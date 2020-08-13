import React, { Component } from 'react';
import { Col, Table, Button, Form, FormGroup, Label, Input, FormText, ButtonToggle, Media, Alert  ,Modal,ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import './Home.css';
import './../img/question 3.jpg';
import './../img/question1.jpg';



class Home extends Component {
    constructor() {
        super();
        this.state = {
            verified : "1" ,
            AlertSucess : false ,
            AlertModal : false,
            AlertModalFeedbackSent : false,
            id_feedbacktemplate: null,
            name: null,
            description: null,
            feedbackQuestionlist: [
                {
                    "id_feedbackquestion": "1",
                    "question": "question1",
                    "response": null
                },
                {
                    "id_feedbackquestion": "2",
                    "question": "question1",
                    "response": null
                }
            ],
            idClient: null, //this.props.idclient ,
            idTemplate: null, //this.props.idtemplate ,
            httppost: {
                "id_client": null,
                "feedback_template": null,

                "feedbackResponselist": [
                    {
                        "id_question": null,
                        "response": null
                    }
                ]
            }
        }
    }
    // getting questions from the spring server
    componentDidMount() {
        // to test correctly const idt = "a5e3z000000kEURAA2" ;
        const idt = this.state.idTemplate;
        const url = "https://sw-feedback-temp-questions.herokuapp.com/feedbacktemplate/" + idt;
        fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            /* console.log(data);
             console.log(data.id_feedbacktemplate);
             console.log(data.feedbackQuestionlist[0].id_feedbackquestion); */
            this.setState({
                id_feedbacktemplate: data.id_feedbacktemplate,
                name: data.name,
                description: data.description,
            });
            var List = [
            ]
            data.feedbackQuestionlist.forEach(element => {
                console.log(element.id_feedbackquestion);
                console.log(element.question);
                List.push({
                    "id_feedbackquestion": element.id_feedbackquestion,
                    "question": element.question,
                    "response": null
                });
            });
            this.setState({ feedbackQuestionlist: List });
            console.log("staaaaaaaaaaaaaaaaaaate");
        });


    }

    // sending feedback to the spring server 
    verifyResponses = () => {
        this.state.verified="1";
        this.state.feedbackQuestionlist.forEach(element => {
            console.log(element.response);
            console.log( ["0","1","2","3","4","5","6","7","8","9","10",null].includes(element.response));
            if(!(["0","1","2","3","4","5","6","7","8","9","10",null,""].includes(element.response))&& element.question.includes("(0-10)")){
                this.state.verified="0";
               // console.log(this.state.verified);
            }
        } );

        return this.state.verified;
    }

    handleSubmitForm = (event) => {
        
        //console.log(this.verifyResponses());
        //console.log('result')
        if(this.state.id_feedbacktemplate == 'a5e3z000000kFHWAA2'){
        if(this.verifyResponses()=="1"){
        this.setState({AlertModal : true});
        console.log("yes");
        console.log(this.state.verified);
        }else{
            console.log("no");
            this.state.verified="1";
            console.log(this.state.verified);
            alert("please check your answers some questions request numbers between 0 and 10 !!!!")
        }
    }else{
        this.setState({AlertModal : true});
    }
        
        
    }


    handleConfirmModal= (event) =>{
        console.log("button submit");
        this.state.feedbackQuestionlist.forEach(element => {
            /*   console.log(element.id_feedbackquestion);
               console.log(element.question);
               console.log(element.response); */
        });
        var Responses = [

        ];
        this.state.feedbackQuestionlist.forEach(element => {
            Responses.push({
                "id_question": element.id_feedbackquestion,
                "response": element.response
            });
        });
        // creating the json body to post
        var toHttpPost = {
            "id_client": this.state.idClient,
            "feedback_template": this.state.idTemplate,

            "feedbackResponselist": Responses

        };

        // END creating the json body to post

        //Sending the json to spring server
        
        fetch('https://sw-feedback-temp-questions.herokuapp.com/feedback/', {
            method: 'POST',
            body: JSON.stringify(toHttpPost),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
            .then(response => response.json())
            .then(json => {
               // this.setState({AlertSucess : true});
               this.setState({AlertModalFeedbackSent : true});
                console.log(json);
            });
            

        // END Sending the json to spring server


        // check for the object toHttpPost
        /*  toHttpPost.feedbackResponselist.forEach(element => {
              console.log(element.id_question);
              console.log(element.response);
          });
          console.log("id client");
          console.log(toHttpPost.id_client);
          console.log("id template");
          console.log(toHttpPost.feedback_template); */
        // END check for the object toHttpPost

        this.setState({AlertModal : false});
        

    }


    hanleCancelModal = (event) =>{
        this.setState({AlertModal : false});

    }

    handleInputChange = (event) => {
        //  console.log("input change");
        //  console.log(event.target.name); 
        //  console.log(event.target.value);
        this.state.feedbackQuestionlist.forEach(element => {
            /* console.log(element.id_feedbackquestion);
             console.log(element.question);
             console.log(element.response);
             */
            if (element.id_feedbackquestion == event.target.name) {
                element.response = event.target.value;
            }

        });

        


    }

    handlereload = (event) =>{
        window.location.reload();

    }




    render() {
        this.state.idClient = this.props.idclient;
        this.state.idTemplate = this.props.idtemplate;
        return (
            <div className="principalcomponent">
                <div>
                    
                    <Modal isOpen={this.state.AlertModal} >
                        <ModalHeader >Feedback Confirmation</ModalHeader>
                        <ModalBody>
                           Are you sure about these responses ?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={this.handleConfirmModal} >Confirm</Button>{' '}
                            <Button color="secondary" onClick={this.hanleCancelModal}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
                <div>
                    
                    <Modal isOpen={this.state.AlertModalFeedbackSent} >
                        <ModalHeader >Feedback Sent </ModalHeader>
                        <ModalBody>
                           Feedbacl Sent Successfully
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={this.handlereload} >OK</Button>{' '}
                        </ModalFooter>
                    </Modal>
                </div>

            <div className="container principalContainer">
                <div className="row">
                <div className="col-md-3"></div>
                    <div className="col-md-6">
                    <Alert color="success" isOpen={this.state.AlertSucess}>
                        Feedback Created
                        
                    </Alert>
                    </div>
                </div>

                <div className="row principalForm">

                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <Media>

                            <Media body className="mediaBody">
                                <Media heading className="mediaHead">
                                    {this.state.name}
                                </Media>
                                {this.state.description}
                            </Media>
                        </Media>

                    </div>

                </div>
                <div className="row PrincipalForm"  >
                    <div className="col-md-3"></div>
                    <div className="col-md-6 scrollbar scrollbar-success questions">
                        
                       
                        <Form >
                            {this.state.feedbackQuestionlist.map((person, i) => <CustomFormGroup key={i} data={person} handleInputChange={this.handleInputChange} />)}
                               
                            </Form>

                        
                    </div>

                </div>
                <div className="row PrincipalForm" >
                <div className="col-md-3"></div>
                <div className="col-md-6 ButtonComponent">
                <Col sm={{ size: 100, offset: 1 }}>
                                <ButtonToggle color="success" size="lg" block onClick={this.handleSubmitForm} >Send Feedback</ButtonToggle>

                            </Col>
                </div>

                </div>
            
            </div>
            </div>

        );
    }


}
class CustomFormGroup extends Component {
    render() {
        return (
            
            <FormGroup>
                <Label for="exampleText" className="questionlabel"> {this.props.data.question} </Label>
                <Input type="textarea" className="questioninput" name={this.props.data.id_feedbackquestion} id="exampleText" onChange={this.props.handleInputChange} />
            </FormGroup>
            
        );
    }
}

export default Home;



// to use
// {this.state.feedbackQuestionlist.map((person, i) => <div> <TableRow key={i} data={person} /></div>)}

// <div> HERE  Home  id client {this.props.idclient}  , idTemplate = {this.props.idtemplate}</div>
