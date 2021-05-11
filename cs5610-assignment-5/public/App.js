class BkHeader extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return /*#__PURE__*/React.createElement("header", {
      class: "bk-header"
    }, bookInfo.bookHeader);
  }

}

class BkProduct extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      class: "bk-product"
    }, /*#__PURE__*/React.createElement(BkIllustration, {
      bookInfo: bookInfo
    }), /*#__PURE__*/React.createElement("main", {
      class: "bk-main"
    }, /*#__PURE__*/React.createElement(BkOrder, {
      bookInfo: bookInfo
    }), /*#__PURE__*/React.createElement(BkDescription, {
      bookInfo: bookInfo
    }))));
  }

}

class BkIllustration extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return /*#__PURE__*/React.createElement("aside", {
      class: "bk-illustration"
    }, bookInfo.bookIllustration);
  }

}

class BkDescription extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return /*#__PURE__*/React.createElement("div", {
      class: "bk-description"
    }, bookInfo.bookDescription);
  }

}

class BkOrder extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      class: "bk-order"
    }, /*#__PURE__*/React.createElement(BkOrderInfo, {
      bookInfo: bookInfo
    }), /*#__PURE__*/React.createElement(BkOrderForm, {
      bookInfo: bookInfo
    })));
  }

}

class BkOrderInfo extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return /*#__PURE__*/React.createElement("div", {
      class: "bk-order-info"
    }, bookInfo.bookOrderInfo);
  }

}

class BkOrderForm extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return /*#__PURE__*/React.createElement("div", {
      class: "bk-order-form"
    }, bookInfo.bookOrderForm);
  }

}

const bookRecord = {
  bookHeader: "bk-header",
  bookIllustration: "bk-illustration",
  bookOrderInfo: "bk-order-info",
  bookOrderForm: "bk-order-form",
  bookDescription: "bk-description"
};

class BkBook extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BkHeader, {
      bookInfo: bookInfo
    }), /*#__PURE__*/React.createElement(BkProduct, {
      bookInfo: bookInfo
    }));
  }

}

const element = /*#__PURE__*/React.createElement(BkBook, {
  bookInfo: bookRecord
});
ReactDOM.render(element, document.getElementById("content"));