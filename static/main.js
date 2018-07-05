class Locator extends React.Component {
    state = {
        lat: '',
        long: '',
        result: '',
        errorMessage: ''
    }
    
    handleChange = name => async event => {
        await this.setState({
          [name]: event.target.value,
        });
        console.log(this.state)
    };
    
    findLocation = async () => {
      
        try{
            const url = `http://localhost:9191/locate?longitude=${this.state.long}&latitude=${this.state.lat}`;
            let res = await fetch(url);
            let resJson = await res.json();

            if (resJson.error){
                this.setState({
                    errorMessage: resJson.Message,
                })
            }
            else{
                this.setState({
                    result: resJson.state,
                    errorMessage: '',
                })
            }
        }
        catch(e){
            console.log(e)
        }
    }


    render() {
        return (
            <div className="center">
                <h4 align="center">
                    State Server!
                </h4>

                <div className="form">
                    <div className="padded">
                        <input placeholder="latitude" onChange={this.handleChange('lat')}  type="number" />
                    </div>
                    <div className="padded">
                        <input placeholder="longitude" onChange={this.handleChange('long')} type="number" /> <br/>
                    </div>
                    <div className="padded">
                        <button onClick={this.findLocation}>Get location</button>
                    </div>

                    {this.state.errorMessage !== '' ?
                        (<div>
                            <b className="error">{this.state.errorMessage}</b>
                        </div>) 
                        :
                        (this.state.result !== '' ? 
                        (<div>
                            Coordinates provided are in <b>{this.state.result}</b>
                        </div>) 
                        : null)
                    }
                </div>
                
            </div>
        );
    }
}
  
ReactDOM.render(
    <Locator />, 
    document.getElementById("root")
); 