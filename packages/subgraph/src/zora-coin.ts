import {
    Transfer as TransferEvent,
    Approval as ApprovalEvent,
} from "../generated/templates/ZoraCoin/ZoraCoin";
import { Transfer, Approval } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
    let entity = new Transfer(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );

    entity.from = event.params.from;
    entity.to = event.params.to;
    entity.value = event.params.value;
    entity.contract = event.address;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleApproval(event: ApprovalEvent): void {
    let entity = new Approval(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );

    entity.owner = event.params.owner;
    entity.spender = event.params.spender;
    entity.value = event.params.value;
    entity.contract = event.address;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}
