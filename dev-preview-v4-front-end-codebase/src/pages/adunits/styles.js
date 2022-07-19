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
  cardContainer: {
    borderRadius: 10
  },
  chartsTitleWrp: {
    marginBottom: 20,
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  customTableContainer: {
    background: 'transparent !important',
    boxShadow: 'none !important'
  },
  customTable: {
    borderCollapse: 'separate !important',
    borderSpacing: '0 15px !important',
    margin: 0,
    padding: 10
  },
  tableRowCustomStyle: {
    backgroundColor: '#fff',
    borderRadius: 10,
    '&:hover': {
      boxShadow: '0px 10px 15px 0px rgb(0, 0, 0, 0.2)',
      backgroundColor: '#fff !important'
    },
    "&.Mui-selected": {
      boxShadow: '0px 10px 15px 0px rgb(0, 0, 0, 0.2)',
      backgroundColor: '#fff !important'
    }
  },
  firstTd: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  lastTd: {
    borderT9opRightRadiuss: 10,
    borderBottomRightRadius: 10
  },
  customIcon: {
    margin: '0 5px',
    display: 'inline-flex'
  },
  editItem: {
    margin: '10px !important',
    backgroundColor: 'rgb(91, 147, 255, 0.05) !important',
    borderRadius: '10px !important',
  },
  deleteItem: {
    margin: '10px !important',
    backgroundColor: 'rgb(231, 29, 54, 0.05) !important',
    borderRadius: '10px !important',
  },
  editLable: {
    color: '#5B93FF !important'
  },
  editIconColor: {
    color: '#5B93FF !important'
  },
  deleteLable: {
    color: '#E71D36 !important'
  },
  deleteIconColor: {
    color: '#E71D36 !important'
  },
  mediaWrp: {
    width: 40,
    height: 40,
    background: '#E2E5ED',
    border: '1px solid #B3B3BF',
    borderRadius: '2px'
  },
  ctrWrp: {
    width: 90,
    height: 45,
    borderRadius: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrGreen: {
    background: 'rgba(58, 151, 76, 0.1)',
    color:'#3A974C'
  },
  ctrPink: {
    background: 'rgba(209, 26, 42, 0.1)'
  },
  calIcon: {
    marginRight: 5,
    fontSize: '14px !important',
    position: 'relative',
    top: 2
  },
  customModalWrp: {

  },
  customCloseIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    cursor: 'pointer'
  },
  customTitle: {
    textAlign: 'center',
    color: '#3661EB',
    fontWeight: 'bold'
  },
  customContentWrp: {
    backgroundColor: '#fff',
    boxShadow: '0px 0px 15px 0px rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    padding: '20px !important',
    margin: '10px 60px',
    width: '480px'
  },
  customInputField: {
    margin: '40px 0px'
  },
  custonButtonWrp: {
    justifyContent: 'space-between !important',
    margin: '20px 60px'
  },
  roundedButton: {
    borderRadius: '20px !important'
  },

  formFileUpload: {
    height: '250px',
    width: '100%',
    maxWidth: '100%',
    textAlign: 'center',
    position: 'relative',
    marginTop: 50
  },
  
  inputFileUpload: {
    display: 'none'
  },
  
  labelFileUpload: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '2px',
    borderRadius: '1rem',
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc'
  },
  
  dragActiveStyle: {
    backgroundColor: '#ffffff'
  },
  
  uploadButton: {
    cursor: 'pointer',
    padding: '0.25rem',
    fontSize: '1rem',
    border: 'none',
    backgroundColor: 'transparent',
    '&:hover' : {
      textDecorationLine: 'underline'
    }
  },
  
  dragFileElement: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }










}));
