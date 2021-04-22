import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Bar from './Bar';
const Compress = require('compress.js')
const compress = new Compress()

const bttnStyle={
    borderRadius: "3vh",
    backgroundColor: "rgb(216, 4, 85)",
    padding: "1vh 2vh",
    filter: "drop-shadow(.2vh .2vh .4vh #242424)",
    margin: "1vh 1vh 1vh 1vh",
    width: "20vh",
    height: "5vh",
    fontSize: "1.5vh"
};

async function resizeImageFn(file) {

    const resizedImage = await compress.compress([file], {
      size: 12, // the max size in MB, defaults to 2MB
      quality: 1, // the quality of the image, max is 1,
      maxWidth: 1920, // the max width of the output image, defaults to 1920px
      maxHeight: 1080, // the max height of the output image, defaults to 1920px
      resize: true // defaults to true, set false if you do not want to resize the image width and height
    })
    const img = resizedImage[0];
    const base64str = img.data
    const imgExt = img.ext
    const resizedFiile = Compress.convertBase64ToFile(base64str, imgExt)
    return resizedFiile;
  }

const Home = (props) => {
    const {
        logOut,
        user
    } = props;

    const [username, setUsername] = useState(''); 
    const [image, setImage] = useState(null);
    const [uploaderror, setUploaderror] = useState('');
    const [dispImg, setDispImg] = useState('');

    const fileSelected = event => {
        setImage(event.target.files[0]);
    }

    const getImage = () => {
        
        setDispImg('http://66.228.51.99:4000/getimage/'+user);
    }
    
    const UploadImage = async () => {
        const fd = new FormData();
        //12*1024

        let newimage = await resizeImageFn(image);
    

        fd.append("UserImage", newimage);
        // image.size / 1024 = Kilobytes
        axios.post('http://66.228.51.99:4000/add/image/'+user, fd).then(response => {
            if(response.status === 200){
                setUploaderror('');
                getImage();
                window.location.reload(false);
            }else{
                setUploaderror('Error uploading file');
            }
        }).catch(err => {
            console.log(err);
        });
        
    }

    

    const getUsername = () =>{
        axios.get('http://66.228.51.99:4000/findUser/'+user).then(response => {
        if(response.data[0].username){
            const users = response.data[0].username;
            setUsername(users);
        }else{
            setUsername('');
        }
        }).catch(error => {
            setUsername('');
        });
    }

    useEffect(() => {
        getUsername();
        getImage();
    }, []);
    


    return (
    <div className="homeBack">
    <Bar />
        <div className="HomePage">
            <Button 
                className="login-button" 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={logOut}
                style={bttnStyle}
            >Log Out

            </Button>
            

            <h2 className="topLabel">My User ID: {user}</h2>
            <h2 className="topLabel">My Username: {username}</h2>

            <form action="/add/image" method="post" encType="multipart/form-data" className="uploadForm">
                <input
                    accept="image/*"
                    className="inputLabel"
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={fileSelected}
                    name="UserImage"
                />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" color="primary" component="span" style={bttnStyle}>
                    Select Image
                    </Button>
                </label>

                <Button variant="contained" color="primary" component="span"
                    onClick={UploadImage} style={bttnStyle}
                >
                    Upload Image
                </Button>
            </form>
            <h4 className="error-message">{uploaderror}</h4>

            <div className="topImageHolder">
                <h2 className="topLabel">Current Image:</h2>
                <div className="topImage"> 
                    <img src={dispImg} id="displayImg1" className="displayImg1" alt="Loading..."></img>
                </div>
            </div>
        </div>
    </div>
    );
}
  
export default Home;

