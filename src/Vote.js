import React, { useState, useEffect, useReducer } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useRadioGroup } from '@material-ui/core';

const bttnStyleNo={
    borderRadius: "3vh",
    backgroundColor: "rgb(216, 4, 85)",
    padding: "1vh 2vh",
    filter: "drop-shadow(.2vw .2vw .4vw #242424)",
    margin: "1vw 1vw 1vw 1vw",
    width: "15vh",
    height: "4vh",
    fontSize: "1.5vh"
};

const bttnStyleYes={
    borderRadius: "3vh",
    backgroundColor: "#17b978",
    padding: "1vh 2vh",
    filter: "drop-shadow(.2vw .2vw .4vw #242424)",
    margin: "1vw 1vw 1vw 1vw",
    width: "15vh",
    height: "4vh",
    fontSize: "1.5vh"
};

const Vote = (props) => {

    const [topitems, setTop] = useState([]);
    const[ready, setReady] = useState(false);
    const [current, setCurrent] = useState(0);

    const { user } = props;
    
    const getTop =  () => {
        setReady(false);
        if(user !== -1){
            axios.get('http://66.228.51.99:4000/users/next/'+user).then(result => {
                let max = result.data.max;
                let res = result.data.result;
                if(res.length > 0){
                    setTop(res);
                }else{
                    setTop([]);
                    axios.get('http://66.228.51.99:4000/getref/'+user).then(result2 => {
                        if(result2.data.theID <= max){
                            getTop();
                        }
                    });
                }
            });
        }
    }

    const handleVote = (vote, users_id, id) => {
        if(ready === true){
            axios.post('http://66.228.51.99:4000/vote', {ballot: vote, img: users_id}).then(result => {
                getTop();
            });
        }
    }

    useEffect( async () => {
        getTop();
    }, []);

    return (
        <div className="vote">

            {(user > 0) ? ( topitems.map((item, idx) => (
                <div key={idx} className="topImageHolder">
                    <div className="topImage"> 
                        <img key={idx+1} id="votingImage" src={'http://66.228.51.99:4000/getimage/'+item.users_id} className="displayImg1" alt="loading..." onLoad={() => setReady(true)} style={!ready ? {visibility:"hidden", width: "0px"} : {}}></img>
                        {!ready ? (
                            <div>LOADING IMAGE...</div>
                        ):(
                            <div></div>
                        )}
                    </div>
                    <div>
                        <Button variant="contained" color="primary" component="span" style={bttnStyleNo}
                            onClick={() => handleVote(0, item.users_id, item.id)}
                        >
                        No
                        </Button>
                        <Button variant="contained" color="primary" component="span" style={bttnStyleYes}
                            onClick={() => handleVote(1, item.users_id, item.id)}
                        >
                        Yes
                        </Button>
                    </div>
                </div>
            ))):(<div></div>)}

            {topitems.length === 0 ? (
                <div>
                    <h1>No More Images to Show</h1>
                </div>
            ):(
                <div></div>
            )}
            
        </div>
    );
}
  
export default Vote;