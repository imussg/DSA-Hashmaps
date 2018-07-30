class _Node {
	constructor(data, next) {
		this.data = data;
		this.next = next;
	}
}

class HashMap {
	constructor(initialCapacity=8) {
		this.length = 0;
		this._slots = [];
		this._capacity = initialCapacity;
		this._deleted = 0;
	}

	get(key) {
		const index = this._findSlot(key);
		if(this._slots[index] === undefined) {
			return null;
		}
		return this._slots[index];
	}

	set(key, value) {
		// the balance between having enough open space to avoid collisions and minimizing unused space and space reallocation
		const loadRatio = (this.length + 1) / this._capacity;
		if(loadRatio > HashMap.MAX_LOAD_RATIO) {
			this._resize(this._capacity * HashMap.SIZE_RATIO);
		}
		const index = this._findSlot(key);
		if(this._slots[index] === undefined) {
			this._slots[index] = {
				key,
				values: new _Node(value, null)
			};
			this.length++;
		} else {
			let node = this._slots[index].values;
			let newHead = new _Node(value, null);
			newHead.next = node;
			// console.log(newHead);
			this._slots[index] = {
				key,
				values: newHead
			};
			// console.log(this._slots[index]);
		}
	}

	remove(key) {
		const index = this._findSlot(key);
		const slot = this._slots[index];
		if(this._slots[index] === undefined) {
			throw new Error('Key error');
		}
		slot.deleted = true;
		this.length--;
		this._deleted++;
	}

	_findSlot(key) {
		const hash = HashMap._hashString(key);
		const start = hash % this._capacity;

		for(let i=start; i<start + this._capacity; i++) {
			const index = i % this._capacity;
			const slot = this._slots[index];
			if(slot === undefined || slot.key == key) {
				return index;
			}
		}
	}

	_resize(size) {
		const oldSlots = this._slots;
		this._capacity = size;
		this.length = 0;
		this._slots = [];

		for (const slot of oldSlots) {
			if(slot !== undefined) {
				this.set(slot.key, slot.value);
			}
		}
	}

	static _hashString(string) {
		let hash = 5381;
		for(let i=0; i<string.length; i++) {
			hash = (hash << 5) + hash + string.charCodeAt(i);
			hash = hash & hash;
		}
		return hash >>> 0;
	}
}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

const lorObj = [{key: "Hobbit", value: "Bilbo"}, {key: "Hobbit", value: "Frodo"}, {key: "Wizard", value: "Gandolf"}, {key: "Human", value: "Aragon"}, {key: "Elf", value: "Legolas"}, {key: "Maiar", value: "The Necromancer"}, {key: "Maiar", value: "Sauron"}, {key: "RingBearer", value: "Gollum"}, {key: "LadyOfLight", value: "Galadriel"}, {key: "HalfElven", value: "Arwen"}, {key: "Ent", value: "Treebeard"}];

function main() {
	// create hashmap class and get value at "Maiar"
	let lor = new HashMap();
	let key, temp;
	let str = "";
	for(let i=0; i<lorObj.length; i++) {
		lor.set(lorObj[i]["key"], lorObj[i]["value"]);
		let node = lor.get(lorObj[i]["key"]);
		console.log(node);
		node = node ? node.values : null;
		if(node) {
			str = `${lorObj[i]["key"]}-> ${node.data}`;
			node = node.next;
			while(node !== null) {
				str += ` -> ${node.data}`;
				node = node.next;
			}
			// console.log(str);
		}
	}

}

// any permutation a palindrome


function canBePalindrome(str) {
	let map = new HashMap();
	let counter = 0;
	let hasOdd = false;
	for(let i=0; i<str.length; i++) {
		map.set(str[i], 1);
	}
	for(let i=0; i<str.length; i++) {
		let vals = map.get(str[i]);
		while(vals.next !== null) {
			counter++;
			vals = vals.next;
		}
		if(counter%2 !== 0) {
			if(hasOdd) {
				return false;
			} else {
				hasOdd = true;
			}
		}
	}
	return true;
}

main();