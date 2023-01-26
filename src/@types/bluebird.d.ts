import * as Bluebird from "bluebird";

export interface DummyConstructor extends Bluebird<any> {
  new <T>(): Bluebird<T>;
}

declare global {
  interface Promise<T> extends Bluebird<T> {
    then(...args: any[]): any;
    catch(...args: any[]): any;
  }

  interface PromiseConstructor extends DummyConstructor {}

  var Promise: Promise<any>;
}

Promise = Bluebird as any;

async function test() {
  console.log("PING");
  await Promise.delay(1000);
  console.log("PONG");
}

test();
