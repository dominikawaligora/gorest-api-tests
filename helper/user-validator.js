export function compareBasicUserData(actualUser, expectedUser) {
    expect(actualUser.id).toBe(expectedUser.id);
    expect(actualUser.email).toBe(expectedUser.email);
    expect(actualUser.name).toBe(expectedUser.name);
    expect(actualUser.gender).toBe(expectedUser.gender);
    expect(actualUser.status).toBe(expectedUser.status);
}

export function comparePosts(actualPost, expectedPost) {
    expect(actualPost).toBe(expectedPost);
}

module.exports = {compareBasicUserData, comparePosts};