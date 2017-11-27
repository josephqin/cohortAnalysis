import React from 'react';
import * as utility from '../utility'
import Selection from './Selection.jsx'

const textStyle = {textAnchor:'start',dominantBaseline:'middle',fill:'#000000',fontSize:'1em'};
const lineStyle = {strokeWidth:'1px',fill:'none'}
const rectStyle = {stroke:'none'}
const panelStyle ={marginTop:'5px',padding:'2px',backgroundColor:'#f0f0f5'}
const canvasStyle ={float:'left'}

const Plot = function(props){
    const lines = utility.createLine(props.data,props.width,props.height).map((line,index)=>(<path key={index} {...line} />))
    return (
        <svg width={props.width} height={props.height}>
            { lines }  
        </svg>
        )
}

class Canvas extends React.Component{

    constructor(props){
        super(props)
    }

    componentDidMount() {
        this.updateCanvas();
    }
    componentDidUpdate() {
        this.updateCanvas();
    }


    updateCanvas() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.props.width, this.props.height);
        utility.canvasDrawV3(ctx,this.props.data,this.props.width,this.props.height,this.props.dataType,this.props.dataRange);
    }
    
    render(){
        return(
            <canvas ref={ref => this.canvas=ref} width={this.props.width} height={this.props.height} />
            )
    }
}

class Infopanel extends React.Component{
   constructor(props){
        super(props);
    }

   render(){
      return (
        <div>
            <div>
            <h3>{this.props.text}</h3>
            <button onClick={this.props.sortFn}>sort</button>
            { this.props.dataType!=='number' && <Selection options={this.props.dataRange} /> }
            <button onClick={this.props.removeFn}>remove</button>
            </div>
        </div>
        )
   }

}

class Row extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
               
        return(
        <div style={panelStyle}>
            <div style={canvasStyle}>
                <Canvas data={this.props.data} dataType={this.props.dataType} dataRange={this.props.dataRange} width={this.props.width} height={this.props.height} />
            </div>
            <Infopanel text={this.props.text} dataType={this.props.dataType} dataRange={this.props.dataRange} sortFn={this.props.sortFn} removeFn={this.props.removeFn} />
            {/*<Plot data={props.data} width={props.width} height={props.height}/>*/}
            
        </div>
        )
    }
    
}

class Panel extends React.Component{

    constructor(props){
        super(props);

        this.state={order:utility.createArray(props.data[0].values.length).map((d)=>0),showRows:props.data.map((d)=>d.name)}
        
    }

    sortFn(entry){
        if(entry.type==='number'){
           this.setState({order:[...entry.values]}) 
       }else{
           this.setState((preState)=>{
            let current = entry.values.map((d)=>entry.range.indexOf(d))
            return {order:preState.order.map((d,index)=>d*entry.range.length+current[index])}
           })
       }
        

    }

    removeFn(entryName){
       this.setState((prestate)=>({showRows:prestate.showRows.filter((d)=>d!==entryName)}))
    }

    // filterFn(filterIndex){
    //    this.setState({show:[...filterIndex]})
    // }

    render(){ 
    
    const {data}=this.props
    const {order,showRows} = this.state
    const orderIndex = order.map((value,index)=>({index,value})).sort((a,b)=>a.value-b.value).map(d=>d.index)
       
    const rows = data.filter((d)=>showRows.includes(d.name)).map((entry,index)=>(
        <Row key={index} 
             text={entry.name} 
             data={orderIndex.map((i)=>entry.values[i])}
             dataType = {entry.type}
             dataRange = {entry.range}
             width={this.props.width} 
             height={60} 
             sortFn={()=>this.sortFn(entry)}
             removeFn={()=>this.removeFn(entry.name)}  
        />))
    
    return(
        <div>
            { rows }
        </div>
        )
      
    }
}
export default Panel;
