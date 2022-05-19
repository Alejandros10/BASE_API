'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/auth/register', 'AuthController.register').validator('User/AuthLogin')
Route.post('/auth/login', 'AuthController.login').validator('User/AuthLogin')

Route.group(() => {
  Route.get('users', 'UserController.index')
  Route.post('users', 'UserController.store').validator('User/StoreUpdate')
  Route.get('users/:id', 'UserController.show')
  Route.put('users/:id', 'UserController.update').validator('User/StoreUpdate')
  Route.delete('users/:id', 'UserController.destroy')
  Route.delete('users', 'UserController.massDestroy')

}).middleware('isUser')
