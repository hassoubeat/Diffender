import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Scroll from 'react-scroll';

import styles from './AppAbout.module.scss';

export default function AppAbout(props = null) {
  // hook setup
  const history = useHistory();

  const moveToTopPage = () => {
    history.push("/");
  }

  const scrollToDOM = (name) => {
    Scroll.scroller.scrollTo(name,{
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  }

  const TopHeader = () => {
    return (
      <div className={styles.topHeader}>
        <h1 className={styles.brand} onClick={ () => {
          moveToTopPage();
        }}>Diffender</h1>
        <div className={styles.space}/>
        <div className={styles.login} onClick={ () => {
          moveToTopPage();
        }}>Diffenderを使う</div>
      </div>
    )
  }

  const HeroContent = () => {
    return (
      <section id="heroContent" className={styles.heroContent}>
        <h2 className={styles.title}>サイトの変更点が一目でわかる</h2>
        <div className={styles.diffVisual}>
          <div className={styles.image}>
            <img className={`${styles.origin}`}  src={"/img/AppAbout/origin.png"} alt="origin" />
          </div>
          <div className={styles.image}>
            <img className={`${styles.diff}`}  src={"/img/AppAbout/diff.png"} alt="diff" />
          </div>
          <div className={styles.image}>
            <img className={`${styles.target}`}  src={"/img/AppAbout/target.png"} alt="target" />
          </div>
        </div>
        <div className={styles.next}>
          <i className="fas fa-angle-double-down" onClick={() => {
            //descriptionContentまでスクロール
            scrollToDOM("descriptionContent");
          }}/>
        </div>
      </section>
    )
  }

  const DescriptionContent = () => {
    return (
      <section id="descriptionContent" name="descriptionContent" className={styles.descriptionContent}>
        WebページのDiff(差分)をピクセルレベルで見つけるE2Eテストサービス
        <h3 className={styles.main}>「Diffender(ディフェンダー)」</h3>
      </section>
    )
  }

  const ImportantFactor = () => {
    return (
      <section id="importantFactor" className={styles.importantFactor}>
        <div className={`${styles.item} ${styles.left}`} onClick={() => {
            scrollToDOM("detailDiffScreenshotContent");
        }}>
          2つのスクリーンショットから差分を検出
        </div>
        <div className={`${styles.item} ${styles.right}`} onClick={() => {
            scrollToDOM("detailUnnecessaryProgramContent");
        }}>
          プログラムを書かないE2Eテスト
        </div>
        <div className={`${styles.item} ${styles.left}`} onClick={() => {
            scrollToDOM("detailOneClickTestContent");
        }}>
          1クリックで最大100ページのテスト
        </div>
        <div className={`${styles.item} ${styles.right}`} onClick={() => {
            scrollToDOM("detailHighSppedTestContent");
        }}>
          テストを高速実行
        </div>
        <div className={`${styles.item} ${styles.left}`} onClick={() => {
            scrollToDOM("detailUseCaseContent");
        }}>
          誰でも使えて、結果が分かる
        </div>
      </section>
    )
  }

  const DetailDiffScreenshotContent = () => {
    return (
      <section name="detailDiffScreenshotContent" className={`${styles.detailContent} ${styles.bgGray} `}>
        <h4 className={styles.title}>2つのスクリーンショットから差分を検出</h4>
        <small className={styles.description}>ブラウザに表示されるWebページのスクリーンショットを撮影、差分の検出をすることで変更点を見つけます</small>
        <div className={styles.visual}>
          <div className={styles.image}>
            <img src={"/img/AppAbout/appVisual.png"} alt="appVisual" />
          </div>
        </div>
      </section>
    )
  }

  const DetailUnnecessaryProgramContent = () => {
    return (
      <section name="detailUnnecessaryProgramContent" className={`${styles.detailContent} ${styles.detailUnnecessaryProgramContent}`}>
        <h4 className={styles.title}>プログラムを書かないE2Eテスト</h4>
        <small className={styles.description}>
          ブラウザ操作をした後のスクリーンショットを撮影、差分の検出をすることができます。<br/>
          フォーム入力やクリックといったブラウザ操作にプログラミングは必要ありません。
          <div className={styles.visual}>
            <div className={styles.useProgram}>
              <div className={styles.title}>通常のE2Eテスト</div>
              <div className={styles.codeEditor}>
                const browser = await puppeteer.launch({'{'}<br/>
                　headless: false<br/>
                {'}'});<br/>
                const  page = await browser.newPage();<br/>
                <br/>
                await page.goto(‘https://example.com/‘);<br/>
                await page.type(‘#searchInput‘, ‘テスト’);<br/>
                await page.click(“#searchButton”);<br/>
                await page.screenshot();<br/>
                <br/>
                await browser.close();<br/>
              </div>
            </div>
            <div className={styles.useDiffender}>
              <div className={styles.title}>Diffender</div>
              <img className={`${styles.image}`}  src={"/img/AppAbout/action.png"} alt="action" />
              <div className={styles.visual}>

              </div>
            </div>
          </div>
        </small>
        <div className={styles.image}></div>
        <div className={styles.note}></div>
      </section>
    )
  }

  const DetailOneClickTestContent = () => {
    return (
      <section name="detailOneClickTestContent" className={`${styles.detailContent} ${styles.detailOneClickTestContent} ${styles.bgGray}`}>
        <h4 className={styles.title}>1クリックで最大100ページのテスト</h4>
        <small className={styles.description}>
          1ページずつテストを行う必要はありません。<br/>
          1クリックで最大100ページのスクリーンショットの撮影、差分の検出が可能です
        </small>
        <div className={styles.visual}>
          <div className={styles.image}>
            <img  src={"/img/AppAbout/oneclick.png"} alt="oneclick" />
          </div>          
        </div>
      </section>
    )
  }

  const DetailHighSppedTestContent = () => {
    return (
      <section name="detailHighSppedTestContent" className={`${styles.detailContent} ${styles.detailHighSppedTestContent}`}>
        <h4 className={styles.title}>テストを高速実行</h4>
        <small className={styles.description}>
          大量のページのスクリーンショットの撮影、差分の検出もマルチタスクですぐに終わります。
        </small>
        <div className={styles.visual}>
          <div className={styles.image}>
            <img  src={"/img/AppAbout/multitask.png"} alt="multitask" />
          </div>          
        </div>
      </section>
    )
  }

  const DetailUseCaseContent = () => {
    return (
      <section name="detailUseCaseContent" className={`${styles.detailContent} ${styles.detailUseCaseContent} ${styles.bgGray}`}>
        <h4 className={styles.title}>誰でも使えて、結果が分かる</h4>
        <div className={styles.useCase}>
          従来のE2Eテストはエンジニアのものでした。<br/>
          ブラウザを動かすテスト用のプログラムを書いてコマンドを叩いて実行する。<br/>
          <br/>
          そのハードルが高く、リリースの度に自らの手でブラウザを操作して意図していない変更がないか？を目視でチェックする作業はとても辛く悲しいものです。<br/>
          <br/>
          そんな誰も幸せにならない作業はもうやめましょう。<br/>
          <br/>
          Diffenderはデザイナーでもディレクターでもクライアントの方でもサイトのE2Eテストを簡単に行うことができます。<br/>
          プログラムを書かなくてもブラウザ操作を交えたテストを作成することができます。<br/>
          またテスト結果もブラウザのスクリーンショットという形で馴染みのある内容であるため、結果の判断も特別な知見がなくても簡単にできます。<br/>
          <br/>
          本サービスはすべてを解決する銀の弾丸にはなりませんが、単純な確認作業に苦しむあなたの力にはなれるかもしれません。<br/>
          <br/>
        </div>
        <div className={styles.button}  onClick={ () => {
          moveToTopPage();
        }}>
          <i className="fas fa-angle-double-right"/> Diffender
        </div>
      </section>
    )
  }

  const Footer = () => {
    return (
      <footer name="footer" className={`${styles.footer}`} onClick={ () => {
        moveToTopPage();
      }}>
        Copyright © Diffender 2020
      </footer>
    )
  }

  return (
    <React.Fragment>
      <div className={styles.appAbout}>
        <TopHeader/>
        <HeroContent/>
        <DescriptionContent/>
        <ImportantFactor/> 
        <DetailDiffScreenshotContent />
        <DetailUnnecessaryProgramContent />
        <DetailOneClickTestContent />
        <DetailHighSppedTestContent />
        <DetailUseCaseContent />
        <Footer />
      </div>
    </React.Fragment>
  );
}