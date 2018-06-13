const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Node Course'
        }, {
            id: '2',
            name: 'Jen',
            room: 'React Course'
        }, {
            id: '3',
            name: 'Julie',
            room: 'Node Course'
        }];
    });

    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: '123',
            name: 'Andrew',
            room: 'The Office Fans'
        };
        var resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should remove a user', () => {
        var user = users.removeUser('1');
        expect(users.users.length).toBe(2);

        expect(user.id).toBe('1');
    });

    it('should not remove a user', () => {
        var user = users.removeUser('4');
        expect(users.users.length).toBe(3);

        expect(user).toNotExist();
    });

    it('should find user', () => {
        var user = users.getUser('1');
        expect(user.id).toBe('1');
    });

    it('should not find user', () => {
        var user = users.getUser('4');
        expect(user).toNotExist();
    });

    it('should return names for node course', () => {
        var userList = users.getUserList('Node Course');

        expect(userList).toEqual(['Mike', 'Julie']);
    });

    it('should return names for react course', () => {
        var userList = users.getUserList('React Course');

        expect(userList).toEqual(['Jen']);
    })
})