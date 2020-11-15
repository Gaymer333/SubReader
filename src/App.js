import './App.scss';
import TypePicker from './components/TypePicker/TypePicker';

function App() {

  return (
    <div className="App">
      <TypePicker/>
      <h2>Made by Peter Andresen</h2>
      <i>Coding test solution for SubReader</i>
      <p>A good test. Make you show skills in understanding of variable types, react state, react render and recursive functions.</p>
      <p>I made my solution in TypeScript. This makes some of the code a little harder to read, but gave me a eaiser time finding type errors beforehand.</p>
      <p>I also use "useState" instead of "extends React.Component". This is for me eaiser to read, and feels more moden</p>
      <p>If i did have more time and other to spare with, would i considder the following:</p>
      <ul>
        <li>Should i make the "prods" definsing diffrents? It can be hard to read.</li>
        <li>I remake the element, everytime i need to add/update/delete a child. Could i do this in a better way?</li>
        <li>I used "useState" and did not use "class [CLASSNAME] extends React.Component". Is this the right call? Do this make the recursive datahandling worse?</li>
        <li>The "TypePicker" code is seperated over 7 functions. Should i try to collect some of the code under less functions?</li>
        <li>OR</li>
        <li>Should i seperate the function into more files?</li>
        <li>I made a Emnu with the Types. But would a static list with type code and type label have been better?</li>
        <li>Should i have made diffrent children variables for Object and Array, instead of using the same list?</li>
        <li>I could even make a "ArrayGetter" that picked the first element in the Object list. But would that be bad UX?</li>
        <li>Will this data logic work optimal for saving to and from JSON?</li>
      </ul>
      <p>If you look in the code, have i comment "CUO" several places. Here is there code, that if i had the time, i would test for optimasation</p>
    </div>
  );
}

export default App;
