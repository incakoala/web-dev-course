class BkHeader extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return (
      <header class="bk-header">
        {bookInfo.bookHeader}
      </header>
    );
  }
}

class BkProduct extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return (
      <React.Fragment>
        <div class="bk-product">
          <BkIllustration bookInfo={bookInfo} />
          <main class="bk-main">
            <BkOrder bookInfo={bookInfo} />
            <BkDescription bookInfo={bookInfo} />
          </main>
        </div>
      </React.Fragment>
    );
  }
}

class BkIllustration extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return (
      <aside class="bk-illustration">
        {bookInfo.bookIllustration}
      </aside>
    );
  }
}

class BkDescription extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return (
      <div class="bk-description">
        {bookInfo.bookDescription}
      </div>
    );
  }
}

class BkOrder extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return (
      <React.Fragment>
        <div class="bk-order">
          <BkOrderInfo bookInfo={bookInfo} />
          <BkOrderForm bookInfo={bookInfo} />
        </div>
      </React.Fragment>
    );
  }
}

class BkOrderInfo extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return (
      <div class="bk-order-info">
        {bookInfo.bookOrderInfo}
      </div>
    );
  }
}

class BkOrderForm extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return (
      <div class="bk-order-form">
        {bookInfo.bookOrderForm}
      </div>
    );
  }
}

const bookRecord = {
  bookHeader: "bk-header",
  bookIllustration: "bk-illustration",
  bookOrderInfo: "bk-order-info",
  bookOrderForm: "bk-order-form",
  bookDescription: "bk-description",
};

class BkBook extends React.Component {
  render() {
    const bookInfo = this.props.bookInfo;
    return (
      <React.Fragment>
        <BkHeader bookInfo={bookInfo} />
        <BkProduct bookInfo={bookInfo} />
      </React.Fragment>
    );
  }
}

const element = <BkBook bookInfo={bookRecord} />;
ReactDOM.render(element, document.getElementById("content"));