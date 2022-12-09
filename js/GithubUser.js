export class GithubUser {
  static search(username) {
    const endPoint = `https://api.github.com/users/${username}`

    return fetch(endPoint)
      .then((data) => data.json())
      .then((user) => {
        return {
          login: user.login,
          name: user.name,
          public_repos: user.public_repos,
          followers: user.followers,
        }
      })
  }
}
