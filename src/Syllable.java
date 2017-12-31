import java.text.Normalizer;
import java.util.Objects;

public class Syllable {
    private char initial;
    private char middle;
    private char end;

    public Syllable(char initial, char middle, char end){
        this.initial = initial;
        this.middle = middle;
        this.end = end;
    }

    public Syllable(String syllable){
        String s = Normalizer.normalize(syllable, Normalizer.Form.NFD);
        initial = s.charAt(0);
        middle = s.charAt(1);
        if(s.length() == 3) {
            end = s.charAt(2);
        } else{
            end = 0;
        }
    }

    public char getInitial() {
        return initial;
    }

    public char getMiddle() {
        return middle;
    }

    public char getEnd() {
        return end;
    }

    @Override
    public String toString(){
        return ""+initial + middle + end;
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof Syllable && this.toString().equals(o.toString());
    }
}
