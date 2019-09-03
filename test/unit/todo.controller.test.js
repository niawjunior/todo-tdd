const TodoController = require('../../controllers/todo.controller')
const TodoModel = require('../../model/todo.model')
const httpMock = require('node-mocks-http')
const newTodo = require('../mock/new-todo.json')
TodoModel.create = jest.fn()

let req = httpMock.createRequest()
let res = httpMock.createResponse()
let next = jest.fn()

describe('TodoController', () => {
  beforeEach(() => {
    req.body = newTodo
  })
  it('should have a createTodo function', () => {
    expect(typeof TodoController.createTodo).toBe('function')
  })
  it('should call TodoModel.create', () => {
    TodoController.createTodo(req, res, next)
    expect(TodoModel.create).toBeCalledWith(req.body)
  })
  it('should return 201 response code', async () => {
    await TodoController.createTodo(req, res, next)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled).toBeTruthy()
  })
  it('should return json body in response', async () => {
    await TodoModel.create.mockReturnValue(newTodo)
    await TodoController.createTodo(req, res, next)
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })
  it('should handle errors', async () => {
    const errorMessage = { message: 'Done property missing'}
    const rejectPromise = Promise.reject(errorMessage)
    TodoModel.create.mockReturnValue(rejectPromise)
    await TodoController.createTodo(req, res, next)
    expect(next).toBeCalledWith(errorMessage)
  })
})