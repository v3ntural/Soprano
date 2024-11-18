wireframes.premium = `
<div id = "premiumPage">
  <div id="premiumBanner">
  <svg viewBox="0 0 781 645" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 592V0H780.5V394.5V418.206C780.5 484.172 716.643 531.298 653.608 511.851L504.915 465.975C450.043 449.046 390.776 472.503 362.354 522.4C291.823 646.222 130.184 682.735 13.2769 601.254L0 592Z" fill="url(#paint0_linear_1597_34)"/>
<defs>
<linearGradient id="paint0_linear_1597_34" x1="0" y1="0" x2="781" y2="753" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF42A7"/>
<stop offset="1" stop-color="#FF4242"/>
</div>
  <div id="premiumInfo">
  <div id="premiumTop">
    <img src="../Images/PremiumLogo.png" id="premiumLogo">
    <div id="premiumBannerText">Level up your Photop experience</div>
    <div class = "premiumButtonWrapper">
      <button class = "subscribe shine" id = "premiumSub">Subscribe</button>
      <button class = "gift shine" id = "premiumGift">Gift</button>
    </div>
    </div>
    <div id = "premiumBenefits">
    <div class = "premiumBenefit">
      <img src="../icons/premium/PremiumEditPosts.svg" class="benefitImageShowcase">
      <div class="premiumBenefitTitle">Editing Content!</div>
      <div class="premiumBenefitDesc">Made a mistake? No worries with editing posts and chats!</div>  
    </div>
    <div class = "premiumBenefit">
      <img src = "../icons/premium/PremiumGIFs.svg" class = "benefitImageShowcase">
      <div class = "premiumBenefitTitle">Animated GIFs!</div>
      <div class="premiumBenefitDesc">Express yourself more freely with animated GIFs!</div>  
    </div>
    <div class = "premiumBenefit">
      <img src = "../icons/premium/PremiumGroups.svg" class = "benefitImageShowcase">
      <div class = "premiumBenefitTitle">More Groups!</div>
      <div class="premiumBenefitDesc">Join up to 75 groups instead of only 25!</div>  
    </div>
    <div class = "premiumBenefit">
      <img src = "../icons/premium/PremiumFileUploads.svg" class = "benefitImageShowcase">
      <div class = "premiumBenefitTitle">MASS Uploads!</div>
      <div class="premiumBenefitDesc">Doubled the max image upload size!</div>  
    </div>
    <div class = "premiumBenefit">
      <img src = "../icons/premium/PremiumCustomURL.svg" class = "benefitImageShowcase">
      <div class = "premiumBenefitTitle">Custom Profile URL!</div>
      <div class="premiumBenefitDesc">Style your profile with a custom URL!</div>  
    </div>
    <div class = "premiumBenefit">
      <img src = "../icons/premium/PremiumLongText.svg" class = "benefitImageShowcase">
      <div class = "premiumBenefitTitle">Longer Text!</div>
      <div class="premiumBenefitDesc">Longer posts, chats, and profile descriptions!</div>  
    </div>
    <div class="premiumBenefit">
      <img src="../icons/premium/PremiumRank.svg" class="benefitImageShowcase">
      <div class = "premiumBenefitTitle">Flex To Others!</div>
      <div class="premiumBenefitDesc">Show your Photop support to others with a special rank!</div>  
    </div>
    </div>
    </div>
</div>
<div id = "premTopShowcase">
  <div>
    <img src = "../icons/premium/PremTop.svg" class = "premTopShowcase">
  </div>
  <div id = "premTopSupport">
    <div id = "premiumHeader"></div>
    <div class = "premiumButtonWrapper">
      <button class = "subscribe shine" id = "premiumSub2">Subscribe</button>
      <button class = "gift shine" id = "premiumGift2">Gift</button>
    </div>
</div>
`;

pages.premium = async function() {
  let phrases = ["Support the platform you love", "Help us keep the lights on", "Help us keep the servers online", "GIVE US MONEY (please)", "Give the gift of happiness (and post editing)", "You wouldn't want it to take 3 billion years for the page to load, would you?","Bytesearch will come back if you buy"];
  findI("premiumHeader").textContent = phrases[Math.floor(Math.random() * phrases.length)];
  const subButton = findI("premiumSub");
  const giftButton = findI("premiumGift");
  const subButton2 = findI("premiumSub2");
  const giftButton2 = findI("premiumGift2");
  const subForm =  `
    <div class="planSelector">
      <div class="plan">
      	<img src="https://exotek.co/images/photop/premium.svg" class="planImg">
        <div class="planPriceInfo">
          <span class="planPrice">$4.99</span>
          <span class="planInterval">/month</span>
        </div>
        <button class="subscribe checkout" id="subscribeMonth">Checkout</button>
      </div>
      <div class="plan">
      	<img src="https://exotek.co/images/photop/premium.svg" class="planImg">
        <div class="planPriceInfo">
          <span class="planPrice">$49.99</span>
          <span class="planInterval">/year</span>
          <span class="planSave">Save 17%!</span>
        </div>
        <button class="subscribe checkout" id="subscribeYear">Checkout</button>
      </div>
    </div>
  `;
  const giftForm =  `
    <div class="planSelector">
      <div class="plan planGift">
      	<img src="../icons/gift.svg" class="planImg">
        <div class="planPriceInfo">
          <span class="planPrice">$4.99</span>
          <span class="planInterval">1 month</span>
        </div>
        <button class="subscribe checkout" id="giftMonth">Checkout</button>
      </div>
      <div class="plan planGift">
      	<img src="../icons/gift.svg" class="planImg">
        <div class="planPriceInfo">
          <span class="planPrice">$27.99</span>
          <span class="planInterval">6 months</span>
          <span class="planSave">Save 7%!</span>
        </div>
        <button class="subscribe checkout" id="gift6Month">Checkout</button>
      </div>
      <div class="plan planGift">
      	<img src="../icons/gift.svg" class="planImg">
        <div class="planPriceInfo">
          <span class="planPrice">$49.99</span>
          <span class="planInterval">1 year</span>
          <span class="planSave">Save 17%!</span>
        </div>
        <button class="subscribe checkout" id="giftYear">Checkout</button>
      </div>
    </div>
  `;
  giftButton.onclick = function() {
    let popUpCode = showPopUp("Choose a Gift", giftForm, [["Cancel", "var(--grayColor)"]]);
    findI("giftMonth").addEventListener("click", function () {
      window.open("https://exotek.co/checkout?product=63a275215a8c1a850aba7674&userid=" + account.AccountID, "_self");
    });
    findI("gift6Month").addEventListener("click", function () {
      window.open("https://exotek.co/checkout?product=63a277305a8c1a850aba7675&userid=" + account.AccountID, "_self");
    });
    findI("giftYear").addEventListener("click", function () {
      window.open("https://exotek.co/checkout?product=63a277485a8c1a850aba7676&userid=" + account.AccountID, "_self");
    });
  }
  subButton.onclick = function() {
    let popUpCode = showPopUp("Choose a Plan", subForm, [["Cancel", "var(--grayColor)"]]);
    findI("subscribeMonth").addEventListener("click", function () {
      window.open("https://exotek.co/checkout?product=63a1229772ad0876f1fef39f&userid=" + account.AccountID, "_self");
    });
    findI("subscribeYear").addEventListener("click", function () {
      window.open("https://exotek.co/checkout?product=63a274ea5a8c1a850aba7673&userid=" + account.AccountID, "_self");
    });
  }
  giftButton2.onclick = function() {
    giftButton.click();
  }
  subButton2.onclick = function() {
    subButton.click();
  }
  window.scrollTo(0, 0);
}