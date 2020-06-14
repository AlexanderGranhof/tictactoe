import React, { FunctionComponent, useRef, useContext, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import "./Home.scss";
import { userContext } from "../../context/user";
import { RouteComponentProps } from "react-router-dom";

const Home: FunctionComponent<RouteComponentProps> = props => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [ userState, setUserState ] = useContext(userContext);
    const { history } = props;
    const [isBadName, setIsBadName] = useState(false);

    const [badwords, setBadwords] = useState<string[]>([]);

    const handlePageClick = () => {
        inputRef.current && inputRef.current.focus();
    };

    const fetchBadWords = async () => {
        const response = await fetch("/badwords.txt");
        const data = await response.text();

        setBadwords(data.split("\n"));
    }

    const isBadWord = (word: string) => {
        return badwords.some(badword => {
            word = word.toLowerCase()
            badword = badword.toLowerCase()

            const result = word === badword && word.length;

            result && console.warn("bad name", word, badword)

            return result;
        })
    }

    const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const isEnter = event.key === "Enter";
        const name = event.currentTarget.value;
        const isBad = isBadWord(name);

        if (inputRef.current) {
            inputRef.current.style.width = `${(name.length + 4) * 36}px`
        }
        

        if (isEnter && !isBad) {
            setUserState({...userState, name})
            history.push("/lobbies")
        }

        setIsBadName(isBad);
    }

    useEffect(() => {
        fetchBadWords()
    }, [])

    return (
        <main className="page welcome-fade">
            <div className="welcome-box" onClick={handlePageClick}>
                <div className="welcome-inputs">
                    <CSSTransition
                        // key={1}
                        timeout={300}
                        in={true}
                        appear={true}
                        classNames="myFade"
                    >
                        <h1 className="welcome-title">Welcome to online TicTacToe, please enter your name</h1>
                    </CSSTransition>
                    <CSSTransition
                        in={isBadName}
                        timeout={300}
                        classNames="bad-word"
                    >
                        <h4 className="error-title">please choose a different name</h4>
                    </CSSTransition>
                    <input maxLength={20} onKeyUp={handleKeydown} ref={inputRef} autoFocus spellCheck={false} className={`welcome-username ${isBadName ? "bad-word" : ""}`} type="text"/>
                </div>
            </div>
        </main>
    )
};

export default Home