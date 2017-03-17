import React, { Component } from 'react';
import { action } from '@kadira/storybook'; // eslint-disable-line
import MessageList from '../../src/components/MessageList/presenter';
import { Code, ComponentWrapper } from '../presenters';

class Presenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      props: {
        level: 50,
      },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;

    this.setState(prevState => ({
      props: {
        ...prevState.props,
        [name]: value,
      },
    }));
  }

  render() {
    const noop = str => str;
    const draftMessage = {
      body: 'Fooo',
    };

    const messages = [
      { message_id: '1', date_received: (new Date()).toJSON(), type: 'email', participants: [{ address: 'bender@caliopen.local', type: 'from' }, { address: 'zoidberg@caliopen.local', type: 'cc' }, { address: 'me@caliopen.local', type: 'to' }], body: '<p>It\'s okay, Bender. I like cooking too. You, minion. Lift my arm. AFTER H=\r\nIM! I don\'t know what you did, Fry, but once again, you screwed up! Now all\r\nthe planets are gonna start cracking wise abo' },
      { message_id: '2', date_received: (new Date()).toJSON(), type: 'email', participants: [{ address: 'bender@caliopen.local', type: 'to' }, { address: 'zoidberg@caliopen.local', type: 'from' }, { address: 'me@caliopen.local', type: 'to' }], body: 'Shut up and take my money! Leela, are you alright? You got wanged on the he=\r\nad. Bender, you risked your life to save me! Spare me your space age techno=\r\nbabble, Attila the Hun! Now that the, uh, ga', subject: "Re: Dr. Zoidberg, that doesn't make sense. But, okay!" },
      { message_id: '3', date_received: (new Date('2017-01-03')).toJSON(), type: 'email', participants: [{ address: 'bender@caliopen.local', type: 'to' }, { address: 'zoidberg@caliopen.local', type: 'to' }, { address: 'me@caliopen.local', type: 'from' }], body: "<p>It's okay, Bender. I like cooking too. You, minion. Lift my arm. AFTER H=\r\nIM! I don't know what you did, Fry, but once again, you screwed up! Now all\r\nthe planets are gonna start cracking wise about our mamas.</p>\r\n<p>You don't know how to do any of those. Leela, Bender, we're going grave\r\nrobbing. And yet you haven't said what I told you to say! How can any of us\r\ntrust you? Leela's gonna kill me. File not found.</p>\r\n<h2>Fry! Quit doing the right thing, you jerk!</h2>\r\n<p>Daddy Bender, we're hungry. Goodbye, cruel world. Goodbye, cruel lamp. G=\r\noodbye, cruel velvet drapes, lined with what would appear to be some sort of\r\n cruel muslin and the cute little pom-pom curtain pull cords. Cruel though\r\n they may be\u2026</p>\r\n<ol>\r\n\r\n    <li>Switzerland is small and neutral! We are more like Germany, ambitio=\r\n\t\tus and misunderstood!</li><li>For the last time, I don't like lilacs! Y=\r\n\t\tour 'first' wife was the one who liked lilacs!</li><li>Isn't it true th=\r\n\t\tat you have been paid for your testimony?</li>\r\n\r\n</ol>\r\n\r\n<h3>I'm sorry, guys. I never meant to hurt you. Just to destroy everything\r\nyou ever believed in.</h3>\r\n<p>Of all the friends I've had\u2026 you're the first. I'm a thing. I was all of\r\nhistory's great robot actors - Acting Unit 0.8; Thespomat; David Duchovny!\r\nGoodbye, friends. I never thought I'd die like this. But I always really ho=\r\nped.</p>\r\n<ul>\r\n\r\n    <li>Is the Space Pope reptilian!?</li><li>Five hours? Aw, man! Couldn't\r\n\t\tyou just get me the death penalty?</li><li>My fellow Earthicans, as I hav=\r\n\t\te explained in my book 'Earth in the Balance'', and the much more popular\r\n\t\t''Harry Potter and the Balance of Earth', we need to defend our planet ag=\r\n\t\tainst pollution. Also dark wizards.</li>\r\n\r\n</ul>\r\n\r\n<p>No, of course not. It was\u2026 uh\u2026 porno. Yeah, that's it. Hi, I'm a naughty\r\nnurse, and I really need someone to talk to. $9.95 a minute. I'll get my kit\r\n! Michelle, I don't regret this, but I both rue and lament it.</p>\r\n<p>Fry! Stay back! He's too powerful! Why not indeed! Now that the, uh, gar=\r\nbage ball is in space, Doctor, perhaps you can help me with my sexual inhib=\r\nitions? Hello, little man. I will destroy you! I'll get my kit!</p>\r\n<p>A true inspiration for the children. Can we have Bender Burgers again? U=\r\ngh, it's filthy! Why not create a National Endowment for Strip Clubs while\r\nwe're at it? They're like sex, except I'm having them!</p>\r\n<p>Oh sure! Blame the wizards! Guards! Bring me the forms I need to fill out\r\n to have her taken away! I guess if you want children beaten, you have to do\r\nit yourself. If rubbin' frozen dirt in your crotch is wrong, hey I don't wa=\r\nnna be right.</p>\r\n<p>Kids don't turn rotten just from watching TV. Hi, I'm a naughty nurse, a=\r\nnd I really need someone to talk to. $9.95 a minute. Perhaps, but perhaps y=\r\nour civilization is merely the sewer of an even greater society above you!\r\n</p>\r\n<p>Hey, guess what you're accessories to. You lived before you met me?! I m=\r\neant 'physically'. Look, perhaps you could let me work for a little food? I\r\ncould clean the floors or paint a fence, or service you sexually?</p>\r\n<p>Fry, you can't just sit here in the dark listening to classical music. T=\r\noo much work. Let's burn it and say we dumped it in the sewer. No! The cat\r\nshelter's on to me. And when we woke up, we had these bodies.</p>\r\n<p>I saw you with those two \"ladies of the evening\" at Elzars. Explain that.\r\nNegative, bossy meat creature! Meh. Our love isn't any different from yours,\r\nexcept it's hotter, because I'm involved.</p>\r\n<p>Yes! In your face, Gandhi! Interesting. No, wait, the other thing: tedio=\r\nus. Daylight and everything. Just once I'd like to eat dinner with a celebr=\r\nity who isn't bound and gagged. Nay, I respect and admire Harold Zoid too m=\r\nuch to beat him to death with his own Oscar.</p>\r\n<p>Yes! In your face, Gandhi! A true inspiration for the children. Man, I'm\r\nsore all over. I feel like I just went ten rounds with mighty Thor. You mean\r\nwhile I'm sleeping in it? Yes, if you make it look like an electrical fire.\r\nWhen you do things right, people won't be sure you've done anything at all.\r\n</p>\r\n<p>They're like sex, except I'm having them! Spare me your space age techno=\r\nbabble, Attila the Hun! Now that the, uh, garbage ball is in space, Doctor,\r\nperhaps you can help me with my sexual inhibitions? Is the Space Pope repti=\r\nlian!?</p>\r\n" },
    ];

    const props = {
      onReply: action('onReply'),
      onForward: action('onForward'),
      onDelete: action('onDelete'),
      __: noop,
    };

    return (
      <div>
        <ComponentWrapper>
          <MessageList messages={messages} {...props} />
        </ComponentWrapper>
        <Code>
          {`
            import MessageList from './src/components/MessageList';

            export default ({ messages = [] }) => {
              return (
                <MessageList messages={messages}  />
              );
            }
          `}
        </Code>
      </div>
    );
  }
}

export default Presenter;
