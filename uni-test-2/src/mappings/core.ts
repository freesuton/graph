import {  Factory, Pool, Swap, _Account } from '../../generated/schema'
import {
    Mint as MintEvent,
    Swap as SwapEvent
  } from '../../generated/templates/Pool/Pool'
import { loadTransaction } from './index'
import { FACTORY_ADDRESS,ONE_BI } from './constants'


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
    let factory = Factory.load(FACTORY_ADDRESS)
    
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
}
