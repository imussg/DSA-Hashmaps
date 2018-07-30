class Stack {
	
	constructor() {
		this.top = null;
	}

	push(data) {
		this.top = new _Node(data, this.top);
	}

	pop() {
		if(this.top === null) {
			return null;
		}
		let temp = this.top;
		this.top = this.top.next;
		return temp.data;
	}

	peek() {
		return this.top.data;
	}

	display() {
		let iter = this.top.next;
		let str = this.top.data;
		while(iter !== null) {
			str += "  " + iter.data;
			iter = iter.next;
		}
		return str;
	}

	isEmpty() {
		return this.top === null;
	}
}

class _Node {
	constructor(data, next) {
		this.data = data;
		this.next = next;
	}
}

function main() {
	let starTrek = new Stack();
	starTrek.push('Kirk');
	starTrek.push('Spock');
	starTrek.push('McCoy');
	starTrek.push('Scotty');

	console.log(starTrek.display());
	console.log(starTrek.pop());
	starTrek.pop();
	starTrek.push('Scotty');
	console.log('+++++ New starTrek Stack ++++++++++++++++++++');
	console.log(starTrek.display());

	console.log(is_palindrome("dad"));
	console.log(is_palindrome("A man, a plan, a canal: Panama"));
	console.log(is_palindrome("1001"));
	console.log(is_palindrome("Tauhida"));

	console.log(matchParens("(((())"));
	
	let stack = new Stack();
	stack.push(15);
	stack.push(100);
	stack.push(30);
	sortStack(stack);
	console.log(stack.display());
}

main();

function is_palindrome(s) {
    s = s.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
    let stack = new Stack();
    let str1 = "", str2 = "";
    let iter = 0;
    while(iter < s.length) {
    	str1 += s[iter];
    	stack.push(s[iter]);
    	iter++;
    }
    iter = 0;
    while(iter < s.length) {
    	str2 += stack.pop().data;
    	iter++;
    }
    if(str1 === str2) {
    	return true;
    } else {
    	return false;
    }
}

function matchParens(exp) {
	let count = 0;
	let iter = 0;
	let pos = new Stack();
	while(iter < exp.length) {
		if(exp[iter] === ")") {
			pos.pop();
			count--;
		} else if(exp[iter] === "(") {
			pos.push(iter);
			count++;
		}
		if(count < 0) {
			return `Error: closed parenthesis without an accompanying open parenthesis at position: ${iter}`;
		}
		iter++;
	}
	if(count !== 0) {
		return `${exp}\nError: All of the parenthesis have not been closed (positions: ${pos.display()})`;
	}

	return "All parentheses are account for.";
}

function sortStack(stack) {
	let temp;
	let reverse = new Stack();

	while(!stack.isEmpty()) {
		temp = stack.pop();
		// console.log(reverse);
		while(!reverse.isEmpty() && reverse.peek() > temp) {
			stack.push(reverse.pop());
		}
		reverse.push(temp);
	}
	while(!reverse.isEmpty()) {
		stack.push(reverse.pop());
	}
}
