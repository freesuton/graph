import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { Bundle, Burn, Factory, Mint, Pool, Swap, Tick, Token, _Account } from '../../generated/schema'
import {
    Burn as BurnEvent,
    Flash as FlashEvent,
    Initialize,
    Mint as MintEvent,
    Swap as SwapEvent
  } from '../../generated/templates/Pool/Pool'
import { Pool as PoolABI } from '../../generated/Factory/Pool'
import { loadTransaction } from './index'

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)
export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'

export function handleInitialize(event: Initialize): void {
    // update pool sqrt price and tick
    let pool = Pool.load(event.address.toHexString())
    // pool.sqrtPrice = event.params.sqrtPriceX96
    // pool.tick = BigInt.fromI32(event.params.tick)
    // pool.save()
}


export function handleSwap(event: SwapEvent): void {
    // update pool sqrt price and tick
    let factory = Factory.load(FACTORY_ADDRESS)
    let pool = Pool.load(event.address.toHexString())
    if(pool == null){
        pool = new Pool(event.address.toHexString())
    }
      // create Swap event
    let transaction = loadTransaction(event)
    let swap = new Swap(transaction.id + '#' + pool.txCount.toString())
    swap.transaction = transaction.id
    swap.recipient = event.params.recipient

    //calculate user amount
    if (factory === null) {
        factory = new Factory(FACTORY_ADDRESS)
    }
    let accountId =  swap.recipient.toHexString()
    let account = _Account.load(accountId)
    if (!account) {
        account = new _Account(accountId);
        account.save();
        factory.userCount = factory.userCount.plus(ONE_BI)
      }
      
    factory.save()
    swap.save()
}

export function handleMint(event: MintEvent): void {
    let poolAddress = event.address.toHexString()
    let pool = Pool.load(poolAddress)
    let factory = Factory.load(FACTORY_ADDRESS)
    
    if (factory === null) {
        factory = new Factory(FACTORY_ADDRESS)
    }
    
    if(pool == null){
        pool = new Pool(event.address.toHexString())
    }

    let transaction = loadTransaction(event)
    let mint = new Mint(transaction.id.toString() + '#' + pool.txCount.toString())
    mint.transaction = transaction.id
    mint.origin = event.transaction.from

     //calculate user amount
     if (factory === null) {
        factory = new Factory(FACTORY_ADDRESS)
    }

    // let accountId = mint.sender.toHexString()
    let account = _Account.load(event.transaction.from.toHexString())
    if (account=== null) {
        account = new _Account(event.transaction.from.toHexString());
        account.save();
        factory.userCount = factory.userCount.plus(ONE_BI)
      }

    factory.save()
    mint.save()
}

export function handleBurn(event: BurnEvent): void {
    let poolAddress = event.address.toHexString()
    let pool = Pool.load(poolAddress)
    let factory = Factory.load(FACTORY_ADDRESS)
    
    if (factory === null) {
        factory = new Factory(FACTORY_ADDRESS)
    }
    
    if(pool == null){
        pool = new Pool(event.address.toHexString())
    }

    let transaction = loadTransaction(event)
    let burn = new Burn(transaction.id + '#' + pool.txCount.toString())
    burn.transaction = transaction.id
    burn.save()
}
  