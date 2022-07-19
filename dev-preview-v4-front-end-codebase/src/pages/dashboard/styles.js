import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  container: {
    flexDirection: 'column'
  },
  headingContainer: {
    marginBottom: 20
  },
  advKey: {
    color: "#353535",
    fontSize: 22,
    textTransform: 'uppercase'
  },
  acBalance: {
    color: "#006dff",
    fontWeight: 500,
    fontSize: 18,
  },
  chartsTitleWrp: {
    marginBottom: 20,
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: -16,
      top: 0,
      background: '#006dff',
      width: 5,
      height: 30,
      borderRadius: 3
    }
  },
  chartsTitle: {
    color: '#3661eb',
    fontSize: 22
  },
  cardContainer: {
    borderRadius: 10,
    padding: 30
  },
  headerWrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  timeFrameWrp: {
    marginBottom: 20
  },
  dateTimeWrp: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 30
  },
  headerIconWrp: {
    width: 59,
    height: 55,
    borderRadius: 10,
    background: '#EBF0FE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 30,
    '&:nth-child(3)' : {
      marginLeft: 0
    }
  },
  blueIconColor: {
    color: '#3661EB',
    fontSize: 25
  },
  boxContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  boxWrapper: {
    background: '#3661eb',
    padding: 10,
    borderRadius: 10,
    marginRight: 18,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0 3px 3.5px 0px rgb(0 0 0 / 16%)'
  },
  whiteBg: {
    background: '#fff'
  },
  iconWrp: {
    width: 50,
    height: 50,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  eyeIcon: {
    color: '#3661eb'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 12,
    flex: 1
  },
  number: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  labelName: {
    fontSize: 16,
    color: '#fff'
  },
  arrowWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIcon: {
    color: '#fff'
  },
  iconWhiteBg: {
    background: '#ebf0fe'
  },
  numberBlack: {
    color: '#353535'
  },
  labelNameBlack: {
    color: '#353535'
  },
  rightIconBlack: {
    color: '#353535'
  },
  noDataContainer: {
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noData: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#222222'
  }
}));
