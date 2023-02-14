import React from 'react';

import Link from 'next/link'
import Image from 'next/image';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import Typography from '@mui/material/Typography';

import Modal from '@mui/material/Modal';

import AccountIcon from '../public/account-icon-240x240.png'

import { Fade } from '../ui/Fade.js'
import { IconClose } from '../ui/Icons.js'
import { roboto } from '../ui/Font.js'

export class ModalCity extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {      
            open: false,
            cityName: this.props.cityName ?? '',
            cityList: this.props.cityList ?? []
        };
    }

    componentDidUpdate(){
        if( this.props.isOpen != this.state.open ){
            this.setState({
                open: this.props.isOpen,
                cityName: this.props.cityName ?? '',
                cityList: this.props.cityList ?? []
            })
        }
    }

    chooseCity(city){
        this.props.close();

        setTimeout(()=>{ 
            window.location.reload(); 
        }, 300)
    }

    getNewLink(city){
        if (typeof window !== 'undefined') {
            let this_addr = window.location.pathname;
            return this_addr.replace(this.state.cityName, city);
        }else{
            return '';
        }
    }

    render(){
        return (
            <Modal
                open={this.props.isOpen}
                onClose={this.props.close}
                closeAfterTransition
                className="class123"
            >
                <Fade in={this.props.isOpen}>
                    
                    <Box className={'modalCity '+roboto.variable}>

                        <IconButton style={{ position: 'absolute', top: -40, left: 15, backgroundColor: 'transparent' }} onClick={this.props.close}>
                            <IconClose style={{ width: 25, height: 25, fill: '#fff', color: '#fff', overflow: 'visible' }} />
                        </IconButton>

                        <div className='loginIMG'>
                            <Image alt="Город" src={AccountIcon} width={180} height={180} />
                        </div>

                        <div className='loginHeader'>
                            <Typography component="h2">Выберите город</Typography>
                        </div>

                        {this.state.cityList.map((item, key) => 
                            <Link 
                                key={key} 
                                className={ this.state.cityName == item.link ? 'active' : '' } 
                                href={ this.getNewLink(item.link) } 
                                onClick={this.chooseCity.bind(this, item.link)}
                            >
                                <Typography variant="h5" component="span" className={"ModalLabel"}>{item.name}</Typography>
                            </Link> 
                        )}
                        
                    </Box>
                    
                </Fade>
            </Modal>
        )
    }
}