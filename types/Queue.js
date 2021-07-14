const Discord = require('discord.js');

module.exports = class Queue extends Discord.Collection {

    /**
     * Identical to [Map.size](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size)
     * @returns The length of the queue collection
     */
    getLength() {
        return this.size;
    }

    /**
     * 
     * @returns The object itself
     */
    getPlayers() {
        return this;
    }

	/**
	 * Identical to [Map.get()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get).
	 * Gets an element with the specified key, and returns its value, or `undefined` if the element does not exist.
	 * @param {string} ID - The key to get from this collection
	 * @returns {* | undefined}
	 */
    getPlayer(ID) {
        return super.get(ID);
    }

/**
	 * Identical to [Map.set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set).
	 * Sets a new element in the collection with the specified key and value.
	 * @param {string} ID - The key of the element to add
	 * @param {string} Username - The value of the element to add
	 * @returns {Collection}
	 */
    addPlayer(ID, username) {
        super.set(ID, username);
    }

/**
	 * Identical to [Map.delete()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete).
	 * Deletes an element from the collection.
	 * @param {string} ID - The key to delete from the collection
	 * @returns {boolean} `true` if the element was removed, `false` if the element does not exist.
	 */
    removePlayer(ID) {
        super.delete(ID);
    }
}