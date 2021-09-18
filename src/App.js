import React, {useEffect, useState} from 'react';
import wordList from './resourses/words.json';

const MAX_TYPED_KEYS = 30;

const getWord = () => {
    const index = Math.floor(Math.random() * wordList.length);
    const word = wordList[index];
    return word.toLowerCase();
}

const isValidKey = (key, word) =>  {
    if (!word) return false;
    const result = word.split('').includes(key);
    return result;
}

const Word = ({word, validKeys}) => {
    if (!word) return null;
    const joinedKeys = validKeys.join('');
    const matched = word.slice(0, joinedKeys.length);
    const remainder = word.slice(joinedKeys.length);
    return (<>
        <span className="matched">{matched}</span>
        <span className="remainder">{remainder}</span>
        </>)
}

const App = () => {
    const [typedKeys, setTypedKeys] = useState([])
    const [validKeys, setvalidKeys] = useState([])
    const [completedWords, setcompletedWords] = useState([])
    const [word, setWord] = useState('');
    useEffect(() => {
        setWord(getWord());
    }, []);
    useEffect(() => {
        const wordFromValidKeys = validKeys.join('').toLowerCase();
        if (word && word === wordFromValidKeys) {
            let newWord = null;
            do {
                newWord = getWord();
            } while(completedWords.includes(newWord));
            setWord(newWord);
            setvalidKeys([]);
            setTypedKeys([]);
            setcompletedWords((prevTypedKeys => [...prevTypedKeys, word]))
        }
    }, [word, validKeys, completedWords]);
    const handleKeyDown = (event) => {
        event.preventDefault();
        const { key } = event;
        setTypedKeys((prevTypedKeys)=>{
            return [...prevTypedKeys, key].slice(MAX_TYPED_KEYS * -1);
        });
        if (isValidKey(key, word)) {
            setvalidKeys((prevTypedKeys) => {
                const isValidLength = prevTypedKeys.length <= word.length;
                const isNextChar = isValidLength && word[prevTypedKeys.length] === key;
                return (isNextChar) ? [...prevTypedKeys, key] : prevTypedKeys;

            })
        }
    }
    return (<div className="container" tabIndex="0" onKeyDown={handleKeyDown}>
        <div className="valid-keys">
            <Word word={word} validKeys={validKeys} />
        </div>
        <div className="typed-keys">{typedKeys ? typedKeys.join(' ') : null}</div>
        <div className="completed-words">
            <ol>
                {completedWords.map((word) => (<li key={word}>{word}</li>))}
            </ol>
        </div>
    </div>);
}

export default App;
