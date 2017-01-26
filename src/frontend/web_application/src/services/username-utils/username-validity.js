import xRegExp from 'xregexp';

const isValid = (username) => {
  // eslint-disable-next-line no-useless-escape,max-len
  const x = xRegExp(/^[^\p{C}\p{M}\p{Lm}\p{Sk}\p{Z} .\u0022,@\u0060:;<>[\\\]]((\.[^\p{C}\p{M}\p{Lm}\p{Sk}\p{Z} .\u0022,@\u0060:;<>[\\\]]|[^\p{C}\p{M}\p{Lm}\p{Sk}\p{Z} .\u0022,@\u0060:;<>[\\\]])){1,40}((\.[^\p{C}\p{M}\p{Lm}\p{Sk}\p{Z} .\u0022,@\u0060:;<>[\\\]])|([^\p{C}\p{M}\p{Lm}\p{Sk}\p{Z} .\u0022,@\u0060:;<>[\\\]]))$/g);

  return x.test(username);
};

const usernameValidity = {
  isValid,
};

export default usernameValidity;
