import isoToDate from '@/index.js'
import 'regenerator-runtime'

describe('business algorithm test', () => {
    const date = '2021-07-08T13:30:00.000Z'

    test('iso to date test', () => {
        expect(isoToDate(date)).toEqual('2021-07-08 22:30')
    })
})