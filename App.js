import React ,{useState}from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity, CheckBox } from 'react-native';
import { sqlite } from "expo"
import Connection from "./connection"

export default class App extends React.Component {
  _isMounted

  constructor(props) {
    super(props)
    this.timeAmount = 50;
    this.timeAdjustment = 1;
    this.intervalSpeed = 100;
    this.db = new Connection()

    this.state = {
      interval: null,
      time: this.timeAmount, 
      started: false,
      pressed: 0,
      isFinished: false,
      scores: []
    }

    this.formatAndAssignScores()
    this.clear = this.clear.bind(this)
    this.clicked = this.clicked.bind(this)
  }

  startInterval() {
    const { interval } = this.state;
    const _i = setInterval(() => {
      this.intervalContent()
    }, this.intervalSpeed)
    
    this.update({interval: _i})
  }

  formatAndAssignScores() {
    this.db.get((res) => {
      
      this.update({
        scores: res.map(score => {
          return {points: score.score, date: score.score_date}
        })
      })
    })
  }
  renderScores() {
    return this.state.scores.sort(this.sortResults).map((s,i) => {      
      return (<View key={i} style={styles.scoresList}>
        <Text style={styles.pointStyle}>{s.points} points</Text>
      </View>)
    
    })
  }

  sortResults(a, b) {
      return a.points - b.points;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false
  }
  
  update(object) {
    if (this._isMounted) {
      this.setState(object)
    }
  }

  formatTime(time) {
    let t = time.toString()
    return time > 9 
              ? `${t[0]}.${t[1]}s`
              : `${0}.${t[0]}s`
  }

  intervalContent() {
    const {time, interval, isFinished, pressed} = this.state;
    if (time === 0) {
      //this.db.insert(pressed)
      clearInterval(interval)
      this.update({isFinished: true})
      this.db.insert(pressed)

      this.formatAndAssignScores()


    } else {
      this.update({time: time - this.timeAdjustment})
    }
  }
  clicked() {
    const { pressed, started, time, isFinished } = this.state
    if (started) {
      if (!isFinished) {
        this.update({pressed: pressed + 1})
      }
    } else {
      this.startInterval()

      this.update({
        pressed: pressed + 1,
        started: true
      }) 
    }
  }

  clear() {
    const { interval } = this.state;
    
    clearInterval(interval)
    this.update({
      pressed: 0,
      interval: null,
      started: false,
      time: this.timeAmount,
      isFinished: false
    })
  }
  
  render() {

    const { time, pressed, isFinished, scores} = this.state;
    return (
      <View style={!isFinished ? styles.container: styles.finishedContainer}>
        
        <View>
          {this.renderScores()}
        </View>
        <View>
          <Text style={styles.timer}>{this.formatTime(time)}</Text>
        </View>

        {!isFinished ?  
        <TouchableOpacity  style={styles.clickerStyle} 
          onPress={this.clicked}>
          <Text style={styles.pressCountStyle}>{pressed}</Text>
        </TouchableOpacity> :  
        <View style={styles.clickerStyle} onPress={this.clicked}>
          <Text style={styles.pressCountStyle}>{pressed}</Text>
        </View>}
        
        <View>
          <Text 
            style={styles.startButton}
            onPress={this.clear}>Start Over</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2ecc71',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishedContainer: {
    flex: 1,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clickerStyle: {
    borderColor: "#34495e",
    backgroundColor: "#3498db",
    borderRadius: 150,
    borderWidth: 10,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    width: 300,
  },
  timer: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center"
  },
  startButton: {
    borderWidth: 1,
    backgroundColor: "#f1c40f",
    color: "#34495e",
    fontSize: 30,
    padding: 10,
    borderRadius: 10,
    textAlign: "center",
    marginTop: 20
    
  },
  pressCountStyle: {
    fontSize: 30
  },
  scoresList: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 10,
  },
  wrapperCollapsibleList: {
    flex: 1,
    marginTop: 20,
    overflow: "hidden",
    backgroundColor: "#FFF",
    borderRadius: 5
  },
  collapsibleItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    padding: 10
  },
  dateStyle: {
    fontSize: 12,
    fontStyle: "italic",
    
  },
  pointStyle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ecf0f1"
  }
});
