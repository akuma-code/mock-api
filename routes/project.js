import { Router } from 'express'
import {
  getAllProjects,
  createFile,
  readFile,
  removeProject
} from '../utils.js'

export default Router()
  .get('/', async (req, res, next) => {
    const { project_name } = req.query
    if (!project_name) return next()
    try {
      const file = await readFile(project_name)
      res.status(200).json(file)
    } catch (err) {
      next(err)
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const projects = (await getAllProjects()) || []
      res.status(200).json(projects)
    } catch (err) {
      next(err)
    }
  })
  .post('/', async (req, res, next) => {
    const { project_name, project_data } = req.body

    try {
      await createFile(project_name, project_data)

      res
        .status(201)
        .json({ message: `Project "${project_name}" was successfully created` })
    } catch (err) {
      next(err)
    }
  })
  .delete('/', async (req, res, next) => {
    const { project_name } = req.query

    try {
      await removeProject(project_name)
      res
        .status(201)
        .json({ message: `Project "${project_name}" was successfully removed` })
    } catch (err) {
      next(err)
    }
  })
