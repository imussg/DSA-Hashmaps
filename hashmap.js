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

	console.log(canBePalindrome("acecarr"));
	strs = ['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race'];
	console.log({"ANAGRAM_GROUPING": groupAnagrams(strs)});
}

// any permutation a palindrome


function canBePalindrome(str) {
	let map = new HashMap();
	let counter = 0;
	let hasOdd = false;
	for(let i=0; i<str.length; i++) {
		let node = map.get(str[i]);
		if(node) {
			let temp = new _Node(node.values.data, null);
			temp.data += 1;
			map.remove(str[i]);
			map.set(str[i], temp.data);
		} else {
			map.set(str[i], 1);
		}
	}
	for(let i=0; i<str.length; i++) {
		let vals = map.get(str[i]);
		counter = vals.values.data;
		// while(vals.next !== null) {
		// 	counter++;
		// 	vals = vals.next;
		// }
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

function groupAnagrams(strings) {
	let parMap, tempMap;
	let grouping = [];
	let tempGroup = [];
	let groupings = [];
	for(let i=0; i<strings.length; i++) {
		parMap = new HashMap();
		for(let j=0; j<strings[i].length; j++) {
			tempMap = parMap.get(strings[i][j]);
			if(tempMap) {
				parMap.set(strings[i][j], tempMap.values.data+1);
			} else {
				parMap.set(strings[i][j], 1);
			}
		}
		// console.log(JSON.stringify(parMap));
		strings[i] = {key: strings[i], map: parMap};
		grouping.push(strings[i].key);
	}
	
	for(let i=0; i<grouping.length; i++) {
		if(grouping[i] !== "") {
			tempGroup = [grouping[i]];
			// let map = strings[i].map;
			// let str = strings[i].key;
			for(let j=0; j<grouping.length; j++) {
				if(i !== j && grouping[j] !== "") {
					if(compareMaps(strings[i], strings[j])) {
						tempGroup.push(grouping[j]);
						grouping[j] = "";
					}
				}
			}
			groupings.push([...tempGroup]);
		}
	}
	return groupings;
}

function compareMaps(word1, word2) {
	let char, count=0;
	while(count < word1.key.length) {
		char = word1.key[count];
		let data1 = word1.map.get(char);
		let data2 = word2.map.get(char);

		if(!data1 || !data2 || data1.data !== data2.data) {
			return false;
		}
		count++;
	}
	return true;
}

main();