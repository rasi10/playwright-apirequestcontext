import { test, expect } from '@playwright/test';
import { APIHelper } from './apiHelpers';
import { generateRandomPostPayload } from './testData';


const BASE_URL= 'http://localhost:3000';

test.describe('Test suite backend V2', () => {
  let apiHelper: APIHelper;

  test.beforeAll(() => {
    apiHelper = new APIHelper(BASE_URL);
  })

  test('Test case 01 - Get all posts - v2', async ({ request }) => {
    const getPosts = await apiHelper.getAllPosts(request);
    expect(getPosts.ok()).toBeTruthy();
  });

  test('Test case 02 - create post - v2', async ({ request }) => {
    const payload = generateRandomPostPayload();
    const createPostResponse = await apiHelper.createPost(request, payload);
    expect(createPostResponse.ok()).toBeTruthy();

    // verifying from the POST requestr
    expect(await createPostResponse.json()).toMatchObject({
      title: payload.title,
      views: payload.views
    })

    // verifying from GET request 
    const getPosts = await apiHelper.getAllPosts(request);
    expect(getPosts.ok()).toBeTruthy();
    expect(await getPosts.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: payload.title, 
          views: payload.views,
        })
      ])
    )
  });

  test('Test case 03 - Delete Post - v2', async ({ request }) => {
    const getPosts = await apiHelper.getAllPosts(request);
    expect(getPosts.ok()).toBeTruthy();
    const allPosts = await getPosts.json();
    const lastButOneID = allPosts[allPosts.length - 2].id;

    //Delete request
    const deleteRequest = await apiHelper.deletePost(request, lastButOneID);
    expect(deleteRequest.ok()).toBeTruthy();

    // GET by ID and verify status as 404
    const getPostById = await apiHelper.getByID(request, lastButOneID);
    expect(getPostById.status()).toBe(404);
  });  
})
