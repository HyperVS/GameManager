# GameManager

## Function Examples
> userExists
```javascript
db.userExists(348905734985738947, res => console.log(res));
// returns true or false
```

> createUser
```javascript
db.createUser(user.id, res => {
    // handle the result
})
```

> getUserInMatch
```javascript
db.getUserInMatch(user.id, res => {

})
```

> updateUserInMatch
```javascript
db.updateUserInMatch(user.id, true);
```

> createMatch
```javascript
db.createMatch(new Map());
```

> getMatch
```javascript
// returns an object. The users in the object is a map
db.getMatch(1, res => console.log(res));
```

> addWin
```javascript
db.addWin(123456)
```

> addLoss
```javascript
db.addLoss(123546)
```

> updateMmr
```javascript
db.updateMmr(123456, 200)
```