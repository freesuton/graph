import { Address } from '@graphprotocol/graph-ts'
import { PoolCreated } from "../../generated/Factory/Factory"
import { Factory,Pool} from "../../generated/schema"
import { Pool as PoolTemplate } from '../../generated/templates'

import { FACTORY_ADDRESS,ONE_BI, ZERO_BI } from './constants'

export function handlePoolCreated(event: PoolCreated): void{
  if (event.params.pool == Address.fromHexString('0x8fe8d9bb8eeba3ed688069c3d6b556c9ca258248')) {
    return
  }

  let factory = Factory.load(FACTORY_ADDRESS)
  if (factory === null) {
    factory = new Factory(FACTORY_ADDRESS)
    factory.txCount = ZERO_BI
    factory.userCount = ZERO_BI
    factory.txCount = factory.txCount.plus(ONE_BI)
  }
  
  let pool = new Pool(event.params.pool.toHexString()) as Pool
  factory.poolCount = factory.poolCount.plus(ONE_BI)
  pool.txCount = pool.txCount.plus(ONE_BI)
  
  PoolTemplate.create(event.params.pool)
  pool.save()
  factory.save()
  
}