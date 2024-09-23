import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { title } from 'process';


test.describe('Test suite backend V1', () => {
  test('Test case 01 - Get all posts', async ({ request }) => {
    const getPostsResponse = await request.get('http://localhost:3000/posts');
    expect (getPostsResponse.ok()).toBeTruthy();
    expect (getPostsResponse.status()).toBe(200);
  });

  test('Test case 02 - Create Post', async ({ request }) => {
    const payload = {
      title: faker.lorem.sentence(),
      views: faker.number.int({min:10, max:100})
    }

    const createPostResponse = await request.post('http://localhost:3000/posts', {
      data: JSON.stringify(payload),
    });
    expect (createPostResponse.ok()).toBeTruthy(); 
    // verify that the response of the post method contains the new record.
    expect (await createPostResponse.json()).toMatchObject(
      expect.objectContaining({
        title:payload.title, 
        views:payload.views,
      })
    )
    //verify that when you get all the posts, the new record is in there.
    const getPostsResponse = await request.get('http://localhost:3000/posts');
    expect (getPostsResponse.ok()).toBeTruthy();
    
    const allPosts = await getPostsResponse.json();
    expect(allPosts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: payload.title, 
          views: payload.views,
        })
      ])
    )
  });

  test('Test case 03 - Delete Post by ID', async ({ request }) => {
    //Get all posts in order to access its elements.
    const getPostsResponse = await request.get('http://localhost:3000/posts');
    expect (getPostsResponse.ok()).toBeTruthy(); //Assertion
    const allPosts = await getPostsResponse.json();
    expect(allPosts.length).toBeGreaterThan(3);
    // retrieve the id of the last but one element in the array.
    const lastButOnePostID = allPosts[allPosts.length - 2].id;

    //DELETE request.
    const deletePostResponse = await request.delete(`http://localhost:3000/posts/${lastButOnePostID}`);
    expect(deletePostResponse.ok()).toBeTruthy();

    //Verify that the element is gone
    const deletedElementResponse = await request.get(`http://localhost:3000/posts/${lastButOnePostID}`)
    expect (deletedElementResponse.status()).toBe(404);
  });
})
