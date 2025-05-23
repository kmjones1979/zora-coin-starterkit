import {
    CoinCreated as CoinCreatedEvent,
    Initialized as InitializedEvent,
    OwnershipTransferred as OwnershipTransferredEvent,
    Upgraded as UpgradedEvent,
} from "../generated/ZoraFactoryImpl/ZoraFactoryImpl";
import {
    CoinCreated,
    Caller,
    Initialized,
    OwnershipTransferred,
    Upgraded,
    CoinCreationEvent,
} from "../generated/schema";
import { ZoraCoin } from "../generated/templates";

export function handleCoinCreated(event: CoinCreatedEvent): void {
    let caller = Caller.load(event.params.caller);

    if (caller === null) {
        caller = new Caller(event.params.caller);
        caller.blockNumber = event.block.number;
        caller.blockTimestamp = event.block.timestamp;
        caller.transactionHash = event.transaction.hash;
        caller.save();
    }

    let entity = new CoinCreated(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.caller = caller.id;
    entity.payoutRecipient = event.params.payoutRecipient;
    entity.platformReferrer = event.params.platformReferrer;
    entity.currency = event.params.currency;
    entity.uri = event.params.uri;
    entity.name = event.params.name;
    entity.symbol = event.params.symbol;
    entity.coin = event.params.coin;
    entity.pool = event.params.pool;
    entity.version = event.params.version;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();

    let tsEvent = new CoinCreationEvent(0);
    tsEvent.coin = event.params.coin;
    tsEvent.caller = event.params.caller;
    tsEvent.currency = event.params.currency;

    tsEvent.save();

    // Create dynamic data source for the new coin contract
    ZoraCoin.create(event.params.coin);
}

export function handleInitialized(event: InitializedEvent): void {
    let entity = new Initialized(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.version = event.params.version;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleOwnershipTransferred(
    event: OwnershipTransferredEvent
): void {
    let entity = new OwnershipTransferred(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.previousOwner = event.params.previousOwner;
    entity.newOwner = event.params.newOwner;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleUpgraded(event: UpgradedEvent): void {
    let entity = new Upgraded(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.implementation = event.params.implementation;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}
