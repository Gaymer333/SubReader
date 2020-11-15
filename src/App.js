import './App.scss';
import TypePicker from './components/TypePicker/TypePicker';

function App() {

  return (
    <div className="App">
      <TypePicker/>
      <h2>Made by Peter Andresen</h2>
      <i>Coding test solution for SubReader</i>
      <p>A good test. Makes you show skills in understanding of variable types, react state, react render and recursive functions.</p>
      <p>I made my solution in TypeScript. This makes some of the code a little harder to read, but gave me an easier time finding type errors beforehand.</p>
      <p>I also use "useState" instead of "extends React.Component". This is, for me, easier to read, and feels more modern</p>
      <p>If I had more time and others to spar with, I would consider the following:</p>
      <ul>
        <li>Should I make the "prods" definition different? It can be hard to read.</li>
        <li>Should I remake the element, everytime i need to add/update/delete a child? Could I do this in a better way?</li>
        <li>I used "useState" and did not use "class [CLASSNAME] extends React.Component". Is this the right call? Does this make the recursive datahandling worse?</li>
        <li>The "TypePicker" code is separated over 7 functions. Should I try to collect some of the code in fewer functions?</li>
        <li>OR</li>
        <li>Should I separate the function into more files?</li>
        <li>I made an Enum with the Types. But would a static list with type code and type label have been better?</li>
        <li>Should I have made different children variables for Object and Array, instead of using the same list?</li>
        <li>I could even make an "ArrayGetter" that picked the first element in the Object list. But would that be bad UX?</li>
        <li>Will this data logic work optimally for saving to and from JSON?</li>
      </ul>
      <p>If you look in the code, have I commented "CUO" several places. Here there is code, that if I had the time, I would test for optimization</p>
    </div>
  );
}

export default App;
