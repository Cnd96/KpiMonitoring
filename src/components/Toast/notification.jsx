import './notification.styles.scss'
import { ToastContainer, toast ,cssTransition} from 'react-toastify';

const Zoom = cssTransition({
    enter: 'zoomIn',
    exit: 'zoomOut',
    // default to 750ms, can be omitted
    duration: 750,
});

const notify=(message,status)=>{
    if(status=="warn"){
        notifyWarn(message)
    }
    else if(status=="success"){
        notifySuccess(message)
    }
    else if(status=="info"){
        notifyInfo(message)
    }
    else if(status=="error"){
        notifyError(message)
    }
}
const notifyWarn = (message) => toast.warn(message,{
    position: "top-center",
    autoClose: 3000,
    transition: Zoom,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
});
const notifySuccess = (message) => toast.success(message,{
    position: "top-center",
    autoClose: 3000,
    transition: Zoom,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
});
const notifyInfo = (message) => toast.info(message,{
    position: "top-center",
    autoClose: 3000,
    transition: Zoom,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
});
const notifyError = (message) => toast.error(message,{
    position: "top-center",
    autoClose: 3000,
    transition: Zoom,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
});
export default notify


