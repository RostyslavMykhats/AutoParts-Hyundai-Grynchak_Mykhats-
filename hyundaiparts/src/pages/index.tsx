import Head from "next/head";
import Image from "next/image";
import s from "@/styles/Home.module.scss";
import { Container, Row, Col } from "react-bootstrap";
import ButtonUi from "@/components/button";


export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={s.main}>
        <div className={`d-flex flex-column align-items-start justify-content-start pb-5 ${s.hero}`}>
          <Container>
            <Row>
              <Col xs={7}>
                <div className={`d-flex flex-column  ${s.hero__content}`}>
                  <h1>GIVE YOUR OLD PARTS</h1>
                  <p className={s.hero__big}>A NEW LIFE</p>
                  <p className="mt-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vestibulum convallis mi ut velit porttitor placerat. Nulla
                    egestas mattis magna, ut luctus ligula mollis sit amet. Nam
                    vitae leo dignissim, sollicitudin eros in, consequat neque.
                    Suspendisse potenti. Quisque in est mauris. Nullam ut
                    sollicitudin ligula.
                  </p>
                  <div className="d-flex gap-5 mt-5">
                    <ButtonUi >
                    START SHOPPING
                    </ButtonUi>
                    <button style={{
                      background: "transparent",
                      border: "1px solid #FF8F28",
                      color: "#FF8F28",
                      padding: "5px 20px",
                      borderRadius: "25px"
                    }}>
                      SELL ITEM
                    </button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </main>
    </>
  );
}
