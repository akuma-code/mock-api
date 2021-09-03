import simpleFetch from '/node_modules/very-simple-fetch/index.js'
import todos from './todos.js'
import { isJson } from './utils.js'

simpleFetch.baseUrl = 'http://localhost:5000/project'

function initProject(name, data) {
  project_name.value = name
  project_data.value = JSON.stringify(data, null, 2)
}

async function getProjects() {
  const { data, error } = await simpleFetch.get({ customCache: false })

  if (error) {
    return console.error(error)
  }

  project_list.innerHTML = ''

  if (data.length === 0) {
    return (project_list.innerHTML = /*html*/ `
      <li class="list-group-item d-flex align-items-center">You have no projects. Why don't create one?</li>
    `)
  }

  const projects = data.map((p) =>
    p.replace(/.+projects\//, '').replace('.json', '')
  )

  for (const p of projects) {
    project_list.innerHTML += /*html*/ `
      <li class="list-group-item d-flex align-items-center" data-name="${p}">
        <span class="flex-grow-1">${p}</span>
        <button class="btn btn-outline-success" data-action="edit"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-outline-danger" data-action="remove"><i class="bi bi-trash"></i></button>
      </li>
    `
  }
}
getProjects()
initProject('todos', todos)
initHandlers()

async function removeProject(name) {
  const response = await simpleFetch.remove(`?project_name=${name}`)
  await handleResponse(response)
}

async function editProject(name) {
  const { data, error } = await simpleFetch.get(`?project_name=${name}`)
  if (error) {
    return console.error(error)
  }
  initProject(name, data)
}

function initHandlers() {
  project_list.onclick = ({ target }) => {
    const action = target.closest('button')?.dataset?.action
    if (!action) return
    const name = target.closest('li').dataset.name
    switch (action) {
      case 'remove':
        return removeProject(name)
      case 'edit':
        return editProject(name)
    }
  }

  project_create.onsubmit = async (e) => {
    e.preventDefault()

    const data = project_data.value.trim()

    const body = {
      project_name: project_name.value.trim(),
      project_data: isJson(data) ? JSON.parse(data) : data
    }

    const response = await simpleFetch.post(body)
    await handleResponse(response)
  }
}

async function handleResponse(response) {
  const { data, error } = response
  if (error) {
    return console.error(error)
  }
  console.log(data.message)
  await getProjects()
}
