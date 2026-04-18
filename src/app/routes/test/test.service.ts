import prisma from '../../../prisma/prisma-client';
import { createUser } from '../auth/auth.service';
import { followUser } from '../profile/profile.service';
import {
  addComment,
  createArticle,
  favoriteArticle,
} from '../article/article.service';

export async function resetDatabase(): Promise<void> {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "Comment", "Article", "User", "Tag" RESTART IDENTITY CASCADE
  `);
}

export async function seedDatabase(): Promise<void> {
  await resetDatabase();

  const password = 'test-password';

  const noimageuser = await createUser({ email: 'noimageuser@example.com', username: 'no_image_user', password, bio: 'No image user bio', image: '', demo: true });
  const nobiouser = await createUser({ email: 'nobiouser@example.com', username: 'no_bio_user', password, bio: '', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=no_bio_user', demo: true });
  const maxuser = await createUser({ email: 'maxuser@example.com', username: 'max_user', password, bio: 'Max user bio', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=max_user', demo: true });
  await createUser({ email: 'minuser@example.com', username: 'min_user', password, bio: '', image: '', demo: true });

  await followUser(noimageuser.username, nobiouser.id);
  await followUser(noimageuser.username, maxuser.id);
  await followUser(nobiouser.username, maxuser.id);

  await prisma.tag.createMany({ data: [{ name: 'tag-1' }, { name: 'tag-2' }, { name: 'tag-lonely' }] });

  const noFavoritesArticle = await createArticle({ title: 'No favorites article', description: 'desc', body: 'body', tagList: ['tag-1'] }, noimageuser.id);
  const noTagsArticle = await createArticle({ title: 'No tags article', description: 'desc', body: 'body' }, maxuser.id);
  const noCommentsArticle = await createArticle({ title: 'No comments article', description: 'desc', body: 'body', tagList: ['tag-2'] }, maxuser.id);
  const maxArticle = await createArticle({ title: 'Max article', description: 'desc', body: 'body', tagList: ['tag-1', 'tag-2'] }, maxuser.id);
  await createArticle({ title: 'Min article', description: 'desc', body: 'body' }, nobiouser.id);

  await favoriteArticle(noTagsArticle.slug, noimageuser.id);
  await favoriteArticle(noCommentsArticle.slug, maxuser.id);
  await favoriteArticle(maxArticle.slug, maxuser.id);
  await favoriteArticle(maxArticle.slug, noimageuser.id);
  await favoriteArticle(maxArticle.slug, nobiouser.id);

  await addComment('Nice post', noFavoritesArticle.slug, maxuser.id);
  await addComment('Thanks for sharing', noTagsArticle.slug, noimageuser.id);
  await addComment('Great article!', maxArticle.slug, nobiouser.id);
  await addComment('Interesting read.', maxArticle.slug, maxuser.id);
}
