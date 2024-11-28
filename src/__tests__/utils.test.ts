import { parseTemplate } from '../utils'

describe('parseTemplate', () => {
  it.each([
    ['Hello, world!', 'Hello, world!'],
    ['<%= 1 + 2 %>', '3'],
    ['<%= 3 * 4 %>', '12'],
    ['<%= 10 / 2 %>', '5'],
    ['<%= 5 - 3 %>', '2'],
    [
      '<%= user.isActive ? "Active" : "Inactive" %>',
      '<%= user.isActive ? "Active" : "Inactive" %>'
    ],
    ['<%- user.name %>', '<%- user.name %>'],
    ['<%= user.name %>', '<%= user.name %>'],
    ['<%= user.name', '<%= user.name'],
    ['user.name %>', 'user.name %>'],
    ['<%= 5 + 3 %> and <%= 2 * 2 %>', '8 and 4']
  ])(
    'should return the correct result for template "%s"',
    (input, expected) => {
      expect(parseTemplate(input)).toBe(expected)
    }
  )
})
