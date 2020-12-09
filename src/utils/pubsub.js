// publisher
// Subscriber
// unsubscribe
// Some place to store callbacks that are registered from subscribers.

export function pubSub() {

  // object which will track of all events and subscription
  const subscribers = {}

  window.subs = subscribers;

  // Publisher:
  function publish(eventName, data) {

    //console.log(eventName, data);

    //console.log(subscribers);

    // return if event is not subscribed
    if (!Array.isArray(subscribers[eventName])) {
      return
    }



    // Whenever you publish any event, it will trigger callback for all stored event in subscriber object
    subscribers[eventName].forEach((callback) => {
      callback(data)
    })
  }

  // Subscriber
  function subscribe(eventName, callback) {

    //console.log(eventName, callback);

    if (!Array.isArray(subscribers[eventName])) {
      subscribers[eventName] = []
    }
    //on subscribe we will we will push callback to subscribers[eventName] array
    subscribers[eventName].push(callback);
    const index = subscribers[eventName].length - 1

    //console.log(subscribers);

    // subscribed callbacks to be removed when they are no longer necessary.
    return {
      unsubscribe() {
        subscribers[eventName].splice(index, 1);
      },
    }
  }

  return {
    publish,
    subscribe,
  }
}