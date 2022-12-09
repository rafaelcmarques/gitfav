import { GithubUser } from "./GithubUser.js"

export class Favorite {
  constructor(root) {
    this.root = document.querySelector(root)
    this.tbody = this.root.querySelector("table tbody")
    this.load()
    this.update()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
  }
}

export class FavoriteView extends Favorite {
  constructor(root) {
    super(root)
    this.onadd()
  }

  async add(username) {
    const user = await GithubUser.search(username)
    try {
      const userExist = this.entries.find((entry) => entry.login === user.login)
      if (userExist) {
        throw new Error("Usuário já favoritado")
      }

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado")
      }
      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  onadd() {
    const btnFavorite = this.root.querySelector(".search button")
    btnFavorite.onclick = () => {
      const { value } = this.root.querySelector(".search input")
      this.add(value)
    }
  }

  update() {
    this.removeAllTr()
    this.entries.forEach((user) => {
      const row = this.createRow()
      row.querySelector(".user img").src = `http://Github.com/${user.login}.png`
      row.querySelector(".user img").alt = `Imagem de ${user.name}`
      row.querySelector(".user a").href = `https://github.com/${user.login}`
      row.querySelector(".user p").textContent = user.name
      row.querySelector(".user span").textContent = `/${user.login}`
      row.querySelector("#repository").textContent = user.public_repos
      row.querySelector("#followers").textContent = user.followers
      row.querySelector("#btnRemove").onclick = () => {
        this.remove(user)
      }

      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement("tr")
    tr.innerHTML = ` <td class="user">
              <img
                src="http://Github.com/rafaelcmarques.png"
                alt="Avatar de Rafael"
              />
              <a href="https://github.com/rafaelcmarques" target="_blank">
                <p>Rafael Marques</p>
                <span>/rafaelcmarques</span>
              </a>
            </td>
            <td id="repository">1323</td>
            <td id="followers">80</td>
            <td><button id="btnRemove">Remover</button></td>
            `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => tr.remove())
  }

  remove(user) {
    const entriesFiltred = this.entries.filter(
      (entry) => entry.login !== user.login
    )
    this.entries = entriesFiltred
    this.update()
    this.save()
  }
}
