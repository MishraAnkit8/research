const pools = require('../../config/db-pool-manager');
const mssqlMock = require('mssql');

jest.mock('mssql', () => ({
  ConnectionPool: jest.fn(() => ({
    connect: jest.fn(),
    close: jest.fn(),
  })),
}));

describe('Pools Module', () => {
  it('creates a new pool when a pool with the specified name does not exist', () => {
    // Arrange
    const poolName = 'testPool';
    const config = { user: 'user', password: 'password', server: 'server', database: 'database' };

    // Act
    const pool = pools.get(poolName, config);

    // Assert
    expect(mssqlMock.ConnectionPool).toHaveBeenCalledWith(config);
    expect(pool).toBeInstanceOf(mssqlMock.ConnectionPool);
  });
});
