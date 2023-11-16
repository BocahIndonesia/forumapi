const PasswordHashInterface = require('../../security/PasswordHashInterface')
const UserRepositoryInterface = require('../../../Domains/users/UserRepositoryInterface')
const UserRegistration = require('../../../Domains/users/entities/UserRegistration')
const UserProfile = require('../../../Domains/users/entities/UserProfile')
const UserUseCase = require('../UserUseCase')

describe('UserUseCase', () => {
  // mocking PasswordHash
  class MockPasswordHash extends PasswordHashInterface {}
  const mockPasswordHash = new MockPasswordHash()

  // mocking UserRepository
  class MockUserRepository extends UserRepositoryInterface {}
  const mockUserRepository = new MockUserRepository()

  // mocking UserUseCase
  const mockUserUseCase = new UserUseCase({
    userRepository: mockUserRepository,
    passwordHash: mockPasswordHash
  })

  describe('Instantiation throws an Error if the one of the dependencies does not implement the interface', () => {
    it('It throws an error if userRepository does not implement UserRepositoryInterface', () => {
      // Action & Assert
      expect(() => new UserUseCase({ userRepository: {}, passwordHash: mockPasswordHash })).toThrowError(UserUseCase.ERROR.INVALID_USER_REPOSITORY)
    })
    it('It throws an error if passwordHash does not implement PasswordHashInterface', () => {
      // Action & Assert
      expect(() => new UserUseCase({ userRepository: mockUserRepository, passwordHash: {} })).toThrowError(UserUseCase.ERROR.INVALID_PASSWORD_HASH)
    })
  })

  describe('register', () => {
    it('It needs to orchestrate user registration correctly', async () => {
      // Arrange
      const payload = {
        username: 'user123',
        fullname: 'user test',
        password: 'supersecret'
      }
      const expectedUserProfile = new UserProfile({
        id: 'user-123',
        username: 'user123',
        fullname: 'user test'
      })
      const userRegistration = new UserRegistration({
        ...payload,
        password: 'hash(password)'
      })

      mockPasswordHash.hash = jest.fn().mockImplementation(() => Promise.resolve('hash(password)'))
      mockUserRepository.register = jest.fn().mockImplementation(() => Promise.resolve({
        id: 'user-123',
        fullname: 'user test',
        username: 'user123',
        password: 'hash(password)'
      }))
      mockUserRepository.verifyUsernameAvailibility = jest.fn().mockImplementation(() => Promise.resolve())

      // Action
      const userProfile = await mockUserUseCase.register(payload)

      // Assert
      expect(mockUserRepository.verifyUsernameAvailibility).toBeCalledWith(payload.username)
      expect(mockPasswordHash.hash).toBeCalledWith(payload.password)
      expect(mockUserRepository.register).toBeCalledWith(userRegistration)
      expect(userProfile).toStrictEqual(expectedUserProfile)
    })
  })
})
