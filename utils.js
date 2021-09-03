import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'

export const __dirname = dirname(fileURLToPath(import.meta.url))
export const PATH = `${__dirname}/projects`

export const createFile = async (name, data) => {
  const path = join(PATH, `${name}.json`)
  await fs.ensureFile(path)
  await fs.writeJSON(path, data)
}

export const readFile = async (name) => {
  const path = join(PATH, `${name}.json`)
  const file = await fs.readJSON(path)
  return file
}

export const getAllProjects = async (path = PATH) => {
  let projects = []

  const list = await fs.readdir(path)

  const empty = list.length === 0
  if (empty) return projects

  for (let file of list) {
    file = `${path}/${file}`
    const dir = (await fs.stat(file)).isDirectory()
    if (dir) {
      projects = projects.concat(await getAllProjects(file))
    } else {
      projects.push(file)
    }
  }
  return projects
}

const removeDir = async (name) => {
  if (!name.includes('/')) return

  name = name.split('/').slice(0, -1).join('/')

  const path = `${PATH}/${name}`

  const empty = (await fs.readdir(path)).length === 0

  if (empty) {
    await fs.remove(path)
    await removeDir(name)
  }
}

export const removeProject = async (name) => {
  const path = `${PATH}/${name}.json`
  await fs.remove(path)
  await removeDir(name)
}
