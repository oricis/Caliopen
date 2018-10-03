export const calcPiValue = ({ pi }) => (pi ? (pi.context + pi.technic + pi.comportment) / 3 : 0);
export const getPiClass = pi => (pi <= 50 ? 'weak-pi' : 'strong-pi');
