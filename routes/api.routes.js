import { Router } from 'express'
import { createFile, readFile, queryMap, areEqual } from '../utils.js'

export default Router()
  .get('*', async (req, res, next) => {
    try {
      const project = await readFile(req.url)
      res.status(200).json(project)
    } catch (e) {
      next(e)
    }
  })
  .get('*/:slug', async (req, res, next) => {
    let project
    try {
      if (Object.keys(req.query).length > 0) {
        project = await readFile(req.url.replace(/\?.+/, ''))

        const notQueryKeyValues = Object.entries(req.query).filter(
          ([k]) => !queryMap[k] && k !== 'order'
        )

        if (notQueryKeyValues.length > 0) {
          project = project.filter((p) =>
            notQueryKeyValues.some(([k, v]) => {
              if (p[k] !== undefined) {
                return p[k].toString() === v.toString()
              }
            })
          )
        }

        if (req.query['sort'] || req.query['order']) {
          project = queryMap.sort(
            project,
            req.query['sort'],
            req.query['order']
          )
        }

        if (req.query['offset']) {
          project = queryMap.offset(project, req.query['offset'])
        }

        if (req.query['limit']) {
          project = queryMap.limit(project, req.query['limit'])
        }
      } else {
        project = await readFile(req.params[0])
        // project = project.find((p) =>
        //   Object.values(p).find((v) => v === req.params.slug)
        // )
        for (const item of project) {
          for (const key in item) {
            if (item[key] === req.params.slug) {
              project = item
            }
          }
        }
      }
      if (!project) return res.sendStatus(404)
      res.status(200).json(project)
    } catch (e) {
      next(e)
    }
  })
  .post('*', async (req, res, next) => {
    try {
      const project = await readFile(req.url)
      const newProject = project.concat(req.body)
      await createFile(req.url, newProject)
      res.status(201).json(newProject)
    } catch (e) {
      next(e)
    }
  })
  .put('*/:slug', async (req, res, next) => {
    const [url, slug] = Object.values(req.params)
    try {
      const project = await readFile(url)
      if (!project) return res.sendStatus(404)
      const newProject = project.map((p) => {
        if (Object.values(p).find((v) => v === slug)) {
          return { ...p, ...req.body }
        } else return p
      })
      if (areEqual(project, newProject)) return res.sendStatus(404)
      await createFile(url, newProject)
      res.status(201).json(newProject)
    } catch (e) {
      next(e)
    }
  })
  .delete('*/:slug', async (req, res, next) => {
    const [url, slug] = Object.values(req.params)
    try {
      const project = await readFile(url)
      if (!project) return res.sendStatus(404)
      const newProject = project.filter(
        (p) => !Object.values(p).find((v) => v === slug)
      )
      if (areEqual(project, newProject)) return res.sendStatus(404)
      await createFile(url, newProject)
      res.status(201).json(newProject)
    } catch (e) {
      next(e)
    }
  })
