export function findAll(namespace) {
  return Object.keys(window.localStorage)
    .filter(name => name.indexOf(namespace) === 0)
    .map(name => ({
      id: name.replace(`${namespace}.`, ''),
      value: window.localStorage.getItem(name),
    }));
}

export function findOne(namespace, id) {
  return window.localStorage.getItem(`${namespace}.${id}`);
}

export function save(namespace, id, value) {
  return window.localStorage.setItem(`${namespace}.${id}`, value);
}

export function remove(namespace, id) {
  return window.localStorage.removeItem(`${namespace}.${id}`);
}
